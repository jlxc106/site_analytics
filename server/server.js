//packages
const express = require("express");
const moment = require("moment");
const _ = require("lodash");
//local files
var { mongoose } = require("./db/mongoose");
var { Logs } = require("./../models/logs");
var { queryByIP, queryByDates } = require("./utils/helper");

var port = process.env.PORT || 3000;
const app = express();

//dev purposes only
app.get("/findByIPAlt/:ip", (req, res)=>{
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

//get all logs by ip address, for multiple requests: separate by &
app.get("/findByIP/:ip", async (req, res) => {
	const ip_raw = req.params.ip.trim();
	const ip = ip_raw.split("&");

	let resObj = {};
	try {
		resObj = await queryByIP(ip);
		res.send(resObj);
	} catch (e) {
		console.log(e);
		res.status(400).send("Invalid Request");
	}
});

//get all logs by date
app.get("/findByDate/:date", async (req, res) => {
    const date_raw = req.params.date.trim();
    const date = date_raw.split("&");
	if (!moment(date[0], "YYYY-MM-DD", true).isValid() || date.length !== 1) {
		res.status(400).send("Invalid Request");
	} else {
        
        try {
            resObj = await queryByDates(date);
            res.send(resObj);
        } catch (e) {
            console.log(e);
            res.status(400).send("Invalid Request");
        }
	}
});

//dev purposes only
app.get("/test", (req, res)=>{
    let day1 = moment('2018-05-11');
    let day2 = moment(day1).add(1, 'days');
    let day3 = moment(day1);
    // let day3 = moment('2018-05-11');
    // day1.add(1, 'days');
    console.log(day1 < day2);
    console.log(day2 < day1);
    console.log(day1.diff(day3));
    // console.log(day1 == day3);
})


//get all logs between any two start and end dates
app.get("/findByDates/:date", async (req, res) => {
	const date_raw = req.params.date.trim();
	const date = date_raw.split("&");
	if (!moment(date[0], "YYYY-MM-DD", true).isValid() ||!moment(date[1], "YYYY-MM-DD", true).isValid()) {
		res.status(400).send("Invalid Request");
	} else {
        let resObj = {};
        try {
            resObj = await queryByDates(date);
            res.send(resObj);
        } catch (e) {
            console.log(e);
            res.status(400).send("Invalid Request");
        }
	}
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
