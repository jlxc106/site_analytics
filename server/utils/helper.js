const moment = require("moment");
const _ = require("lodash");
//local files
var { mongoose } = require("./../db/mongoose");
var { Logs } = require("./../../models/logs");

const queryByIP = array_ip => {
	return new Promise((resolve, reject) => {
		let someObj = {};
		try {
			array_ip.forEach((ip, index) => {
				Logs.find({ ip }).then(result => {
					someObj[ip] = result;
					if (index === array_ip.length - 1) {
						resolve(someObj);
					}
				});
			});
		} catch (e) {
			reject(e);
		}
	});
};

const queryByDates = array_dates => {
	//array_dates[0] --start date ,, array_dates[1] -- end date
	return new Promise((resolve, reject) => {
		let someObj = {};
		try {
			if (array_dates.length === 1) {     //called by findByDate
				var begin_day = moment(array_dates[0]).startOf("day");
				var end_day = moment(begin_day).add(1, "days");
				Logs.find({
					"access date": {
						$gte: begin_day.toDate(),
						$lt: end_day.toDate()
					}
				}).then(result => {
					someObj[array_dates[0]] = result;
					resolve(someObj);
				});
			}else{                              //called by findByDate
                let startingDate = moment(array_dates[0]);
                let endingDate = moment(array_dates[1]);
                var number_of_days = endingDate.diff(startingDate, 'days');
                // console.log('num days: ',number_of_days);
                var list_of_dates = [];
                for(let i=0; i<=number_of_days; i++){
                    list_of_dates.push(moment(startingDate).add(i, "days"));
                }
                // console.log('list_of_dates', list_of_dates);
                list_of_dates.forEach((date, index)=>{
                    const key = date.format("YYYY-MM-DD");
                    //console.log(index);
                    var begin_day = moment(date).startOf('day');
                    var end_day = moment(begin_day).add(1, "days");
                    // console.log(startingDate);
                    Logs.find({
                        "access date": {
                            $gte: begin_day.toDate(),
                            $lt: end_day.toDate()
                        }
                    }).then(result => {
                        someObj[key] = result;
                        if(index === list_of_dates.length - 1){
                            resolve(someObj);
                        }
                    });
                })
            }
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = { queryByIP, queryByDates };
