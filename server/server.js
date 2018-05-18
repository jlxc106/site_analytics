//packages
const express = require("express");
const moment = require("moment");
const _ = require("lodash");
//local files
var { mongoose } = require("./db/mongoose");
var { Logs } = require("./../models/logs");
// var { queryByIP, queryByDates } = require("./utils/helper");

var port = process.env.PORT || 3000;
const app = express();

//dev purposes only
app.get("/findByIPAlt/:ip", (req, res) => {
	const ip_raw = req.params.ip.trim();
	const ip = ip_raw.split("&");
	try {
		Logs.find({
			ip: { $in: ip }
		}).then(results => {
			if (_.isEmpty(results)) {
				res.status(400).send("Invalid Request");
			} else {
				res.send(results);
			}
		});
	} catch (e) {
		console.log(e);
		res.status(400).send("Invalid Request");
	}
});

// new way using Promise.all()
//get all logs by ip address, for multiple requests: separate by &
app.get("/findByIP/:ip", (req, res) => {
	const ip_raw = req.params.ip.trim();
	const array_of_ip = ip_raw.split("&");
	let resObj = {};

	var promise = array_of_ip.map((ip, index) => {
		return new Promise((resolve, reject) => {
			try {
				let someObj = {};
				Logs.find({ ip }).then(result => resolve(result));
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
	});

	Promise.all(promise)
		.then(response => {
			array_of_ip.forEach((value, index) => {
				resObj[value] = response[index];
			});
			res.send(resObj);
		})
		.catch(e => res.status(400).send("Invalid Request"));
});

//get all logs by date
app.get("/findByDate/:date", async (req, res) => {
	const date_raw = req.params.date.trim();
	const array_of_date = date_raw.split("&");
	if (!moment(array_of_date[0], "YYYY-MM-DD", true).isValid() ||array_of_date.length !== 1) {
		res.status(400).send("Invalid Request");
	} else {
		let resObj = {};
		var promise = array_of_date.map((date, index) => {
			return new Promise((resolve, reject) => {
				try {
					var begin_day = moment(date).startOf("day");
					var end_day = moment(begin_day).add(1, "days");
					Logs.find({
						"access date": {
							$gte: begin_day.toDate(),
							$lt: end_day.toDate()
						}
					}).then(result => resolve(result));
				} catch (e) {
					console.log(e);
					reject(e);
				}
			});
		});

		Promise.all(promise)
			.then(response => {
				array_of_date.forEach((value, index) => {
					resObj[value] = response[index];
				});
				res.send(resObj);
			})
			.catch(e => res.status(400).send("Invalid Request"));
	}
});

//get all logs between any two start and end dates
app.get("/findByDates/:date", async (req, res) => {
	const date_raw = req.params.date.trim();
	const array_date = date_raw.split("&");
	if (!moment(array_date[0], "YYYY-MM-DD", true).isValid() ||!moment(array_date[1], "YYYY-MM-DD", true).isValid()) {
		res.status(400).send("Invalid Request");
	} else {
        let resObj = {};

        let startingDate = moment(array_date[0]);
        let endingDate = moment(array_date[1]);
        var list_of_dates = [];
        var number_of_days = endingDate.diff(startingDate, 'days');
        for(let i=0; i<=number_of_days; i++){
            list_of_dates.push(moment(startingDate).add(i, "days"));
        }

        var promise = list_of_dates.map((date, index)=>{
            return new Promise((resolve, reject)=>{
                var begin_day = moment(date).startOf('day');
                var end_day = moment(begin_day).add(1, "days");
                Logs.find({
                    "access date": {
                        $gte: begin_day.toDate(),
                        $lt: end_day.toDate()
                    }
                }).then(result => {
                    resolve(result);
                }, (e)=>{
                    console.log(e);
                    reject(e);
                });                
            })
        })

        Promise.all(promise).then(response=>{
            response.forEach((item, index) =>{
                const key = list_of_dates[index].format("YYYY-MM-DD");
                resObj[key] = item;
            })
            res.send(resObj);
        }).catch(e => res.status(400).send("Invalid Request"));
	}
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
