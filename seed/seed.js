const {Logs} = require('./../models/logs');
const {ObjectId} = require('mongodb');

const seedLogs = [{
    "_id" : ObjectId("5afd30177d80c70b8ce041a5"),
    "access date" : new Date("2018-05-15T21:12:15.000Z"),
    "request" : "GET / HTTP/1.1",
    "status" : 404,
    "size" : 6976,
    "referrer" : "-",
    "user agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
    "ip" : "54.215.254.26",
    "__v" : 0
},
{
    "_id" : ObjectId("5afd30177d80c70b8ce0418b"),
    "access date" : new Date("2018-05-15T08:25:32.000Z"),
    "request" : "HEAD / HTTP/1.1",
    "status" : 200,
    "size" : 6386,
    "referrer" : "-",
    "user agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36 OPR/42.0.2393.94",
    "ip" : "185.92.73.106",
    "__v" : 0
},
{
    "_id" : ObjectId("5afd30177d80c70b8ce0418c"),
    "access date" : new Date("2019-05-15T08:25:32.000Z"),
    "request" : "HEAD / HTTP/1.1",
    "status" : 200,
    "size" : 6386,
    "referrer" : "-",
    "user agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36 OPR/42.0.2393.94",
    "ip" : "185.92.73.106",
    "__v" : 0
}]

const populateLogs = done => {
	Logs.remove({})
		.then(() => {
			return Logs.insertMany(seedLogs);
		})
		.then(() => {
			done();
		});
};

module.exports = {seedLogs, populateLogs};