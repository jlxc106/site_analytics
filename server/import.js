const moment = require("moment");
const axios = require("axios");

const { Logs } = require("./../models/logs");
var { mongoose } = require("./db/mongoose");
// const seedData = require("./../seed/seedData.json");
const { formatData } = require("./utils/formatData");

const storeLogsAlt = (data, index) => {
	return new Promise((resolve, reject) => {
		var newLog = new Logs(formatData(data));
		newLog.save().then(
			newLog => {
				resolve("success");
			},
			e => {
				// console.log(e);
				reject(e);
			}
		);
	});
};

// const currentDate = moment().format("YYYY-MM-D");
const currentDate = moment()
	.add(1, "days")
	.format("YYYY-MM-D");

// console.log(currentDate);
// var counter = 0;
axios
	.get(`https://www.jayclim.com/site_watch/logs/${currentDate}.json`)
	.then(seedData => {
		seedData.data.forEach((data, index) =>{
			storeLogsAlt(data, index).then(
				() => {
                    // counter++;
					// console.log("document logged");
					if (index + 1 === seedData.data.length) {
                        console.log('total documents added: ', seedData.data.length);
                        // console.log(`${counter} documents logged`);
                        mongoose.disconnect();
					}
				},
				e => {
					console.log(e);
					if (index + 1 === seedData.data.length) {
                        console.log('total documents added: ', seedData.data.length);
                        // console.log(`${counter} documents logged with error.`);
						mongoose.disconnect();
					}
				}
			)
        }

		);
	})
	.catch(e => {
        console.log(e.message);
        mongoose.disconnect();
	});
