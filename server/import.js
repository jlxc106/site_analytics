const moment = require("moment");
const axios = require("axios");

const { Logs } = require("./../models/logs");
var { mongoose } = require("./db/mongoose");
const { formatData } = require("./utils/formatData");

const currentDate = moment()
	.add(-9, "days")
	.add(-5, 'hours')
	.format("YYYY-MM-DD");

// from -1 days to -9
	console.log(currentDate);
var counter = 0;

axios
	.get(`https://www.jayclim.com/site_watch/logs/${currentDate}.json`)
	.then(
		seedData => {
			var result = seedData.data;
			var storeLogs = result.map((data, index) => {
				return new Promise((resolve, reject) => {
					var newLog = new Logs(formatData(data));
					newLog.save().then(
						() => {
                            counter++;
							resolve(data);
						},
						e => {
							reject(e);
						}
					);
				});
			});

			Promise.all(storeLogs).then(
				res => {
                    // console.log(res);
                    console.log(`${counter} documents added`);
					mongoose.disconnect();
				},
				e => {
					console.log(e);
					mongoose.disconnect();
				}
			);
		}
	)
	.catch(e => {
		console.log(e.message);
		mongoose.disconnect();
	});
