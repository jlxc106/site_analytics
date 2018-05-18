const moment = require("moment");
const axios = require("axios");

const { Logs } = require("./../models/logs");
var { mongoose } = require("./db/mongoose");
const { formatData } = require("./utils/formatData");

const currentDate = moment()
	.add(1, "days")
	.format("YYYY-MM-D");

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


    // Old Method prior to using Promise.all()

    // const storeLogsAlt = (data, index) => {
    //     return new Promise((resolve, reject) => {
    //         var newLog = new Logs(formatData(data));
    //         newLog.save().then(
    //             newLog => {
    //                 resolve("success");
    //             },
    //             e => {
    //                 // console.log(e);
    //                 reject(e);
    //             }
    //         );
    //     });
    // };
    
    // axios
    //     .get(`https://www.jayclim.com/site_watch/logs/${currentDate}.json`)
    //     .then(seedData => {
    //         seedData.data.forEach((data, index) =>{
    //             storeLogsAlt(data, index).then(
    //                 () => {
    //                     // counter++;
    //                     // console.log("document logged");
    //                     if (index + 1 === seedData.data.length) {
    //                         console.log('total documents added: ', seedData.data.length);
    //                         // console.log(`${counter} documents logged`);
    //                         mongoose.disconnect();
    //                     }
    //                 },
    //                 e => {
    //                     console.log(e);
    //                     if (index + 1 === seedData.data.length) {
    //                         console.log('total documents added: ', seedData.data.length);
    //                         // console.log(`${counter} documents logged with error.`);
    //                         mongoose.disconnect();
    //                     }
    //                 }
    //             )
    //         }
    
    //         );
    //     })
    //     .catch(e => {
    //         console.log(e.message);
    //         mongoose.disconnect();
    //     });
    