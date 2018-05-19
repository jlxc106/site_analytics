//packages
const express = require("express");
const moment = require("moment");
const _ = require("lodash");
const path = require("path");
const fs = require('fs');

//local files
var { mongoose } = require("./db/mongoose");
var { Logs } = require("./../models/logs");
const publicPath = path.join(__dirname, "../public");
const chartPath = path.join(__dirname, "../node_modules/chart.js/dist")

var port = process.env.PORT || 3000;
const app = express();

app.use(express.static(publicPath));
app.use(express.static(chartPath));


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.use((req, res, next) => {
    var now = new Date().toString();
    
    var log = `${now}: ${req.method} ${req.url}`;
     console.log(log);
    fs.appendFile('server.log', log + '\n', (err)=>{
      if(err){
        console.log('Unable to append to server.log');
      }
    });
    next();
  });

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

//organize results from date by ip/network status
app.get("/findByDate/:date/:category", (req, res) => {
    const date_raw = req.params.date.trim();
    const category = req.params.category.trim();
    const array_of_date = date_raw.split("&");
	if (!moment(array_of_date[0], "YYYY-MM-DD", true).isValid() || array_of_date.length !== 1 || (!category=="ip" && !category=="status")) {
        console.log(array_of_date);
        console.log(typeof category);
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
					}).then(result => {
                        if(_.isEmpty(result)){
                            res.status(204).send('no content');
                        }
                        else{
                            resolve(result);
                        }
                    });
				} catch (e) {
					console.log(e);
					reject(e);
				}
			});
		});

		Promise.all(promise)
			.then(response => {
				array_of_date.forEach((value, index) => {
                    resObj[value] = {}; //initialize keys
                    response[index].forEach((docObj)=>{        
                        var category_value = docObj[category];
                        if(!_.hasIn(resObj[value], category_value)){
                            resObj[value][category_value] = [];
                        }
                        resObj[value][category_value].push(docObj);
                    })
				});
				res.send(resObj);
			})
			.catch(e => res.status(400).send("Invalid Request"));
	}
});




//get all logs by date
app.get("/findByDate/:date", (req, res) => {
	const date_raw = req.params.date.trim();
	const array_of_date = date_raw.split("&");
	if (
		!moment(array_of_date[0], "YYYY-MM-DD", true).isValid() ||
		array_of_date.length !== 1
	) {
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
					}).then(result => {
                        if(_.isEmpty(result)){
                            res.status(204).send('no content');
                            // reject('no logs for this date')
                        }
                        else{
                            resolve(result);
                        }
                    });
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

app.get("/findByDates/:date/:category", (req, res) => {
    const date_raw = req.params.date.trim();
    const category = req.params.category.trim();

	const array_date = date_raw.split("&");
	if (!moment(array_date[0], "YYYY-MM-DD", true).isValid() ||!moment(array_date[1], "YYYY-MM-DD", true).isValid() || (!category=="ip" && !category=="status")) {
		res.status(400).send("Invalid Request");
	} else {
		let resObj = {};

		let startingDate = moment(array_date[0]);
		let endingDate = moment(array_date[1]);
		var list_of_dates = [];
		var number_of_days = endingDate.diff(startingDate, "days");
		for (let i = 0; i <= number_of_days; i++) {
			list_of_dates.push(moment(startingDate).add(i, "days"));
		}

		var promise = list_of_dates.map((date, index) => {
			return new Promise((resolve, reject) => {
				var begin_day = moment(date).startOf("day");
				var end_day = moment(begin_day).add(1, "days");
				Logs.find({
					"access date": {
						$gte: begin_day.toDate(),
						$lt: end_day.toDate()
					}
				}).then(
					result => {
						resolve(result);
					},
					e => {
						console.log(e);
						reject(e);
					}
				);
			});
		});

		Promise.all(promise)
			.then(response => {
				response.forEach((value, index) => {
					const key = list_of_dates[index].format("YYYY-MM-DD");
					if (value && !_.isEmpty(value)) {
                        resObj[key] = {}; //initialize keys
                        response[index].forEach((docObj)=>{        
                            var category_value = docObj[category];
                            if(!_.hasIn(resObj[key], category_value)){
                                resObj[key][category_value] = [];
                            }
                            resObj[key][category_value].push(docObj);
                        })
						// resObj[key] = value;
					}
				});
				res.send(resObj);
			})
			.catch(e => res.status(400).send("Invalid Request"));
	}
});

//get all logs between any two start and end dates
app.get("/findByDates/:date", (req, res) => {
	const date_raw = req.params.date.trim();
	const array_date = date_raw.split("&");
	if (
		!moment(array_date[0], "YYYY-MM-DD", true).isValid() ||
		!moment(array_date[1], "YYYY-MM-DD", true).isValid()
	) {
		res.status(400).send("Invalid Request");
	} else {
		let resObj = {};

		let startingDate = moment(array_date[0]);
		let endingDate = moment(array_date[1]);
		var list_of_dates = [];
		var number_of_days = endingDate.diff(startingDate, "days");
		for (let i = 0; i <= number_of_days; i++) {
			list_of_dates.push(moment(startingDate).add(i, "days"));
		}

		var promise = list_of_dates.map((date, index) => {
			return new Promise((resolve, reject) => {
				var begin_day = moment(date).startOf("day");
				var end_day = moment(begin_day).add(1, "days");
				Logs.find({
					"access date": {
						$gte: begin_day.toDate(),
						$lt: end_day.toDate()
					}
				}).then(
					result => {
						resolve(result);
					},
					e => {
						console.log(e);
						reject(e);
					}
				);
			});
		});

		Promise.all(promise)
			.then(response => {
				response.forEach((value, index) => {
					const key = list_of_dates[index].format("YYYY-MM-DD");
					if (value && !_.isEmpty(value)) {
						resObj[key] = value;
					}
				});
				res.send(resObj);
			})
			.catch(e => res.status(400).send("Invalid Request"));
	}
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
