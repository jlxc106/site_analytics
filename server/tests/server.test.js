const expect = require("expect");
const request = require("supertest");

const { app } = require("./../server.js");
const { Logs } = require("./../../models/logs");
const { seedLogs, populateLogs } = require("./../../seed/seed");

beforeEach(populateLogs);

describe("GET /findByIP/:ip", () => {
	const ip = "54.215.254.26";
	it("should get one document", done => {
		request(app)
			.get(`/findByIP/${ip}`)
			.expect(200)
			.expect(res => {
				expect(res.body[ip].length).toBe(1);
				done();
			})
			.catch(e => {
				console.log(e);
				done(e);
			});
	});
	const ip_2 = "185.92.73.106";
	it("should get two document", done => {
		request(app)
			.get(`/findByIP/${ip_2}`)
			.expect(200)
			.expect(res => {
				expect(res.body[ip_2].length).toBe(2);
				done();
			})
			.catch(e => {
				console.log(e);
				done(e);
			});
	});

	it("should get three document", done => {
		request(app)
			.get(`/findByIP/${ip}&${ip_2}`)
			.expect(200)
			.expect(res => {
				expect(res.body[ip_2].length + res.body[ip].length).toBe(3);
				done();
			})
			.catch(e => {
				console.log(e);
				done(e);
			});
	});

	it("should fail with 400 status code", done => {
		request(app)
			.get(`/findByIP/12345678990`)
			.expect(400)
			.end(done);
	});
});

describe("GET /findByDate/", () => {
	it("should get one document", done => {
		request(app)
			.get(`/findByDate/2019-05-15`)
			.expect(200)
			.expect(res => {
				expect(res.body["2019-05-15"].length).toBe(1);
				expect(res.body["2019-05-15"][0]["access date"]).toBe(
					"2019-05-15T08:25:32.000Z"
				);
				done();
			})
			.catch(e => {
				console.log(e);
				done(e);
			});
	});

	it("should order documents by status", done => {
		request(app)
			.get("/findByDate/2018-05-15/status")
			.expect(200)
			.expect(res => {
				expect(
					res.body["2018-05-15"]["200"].length +
						res.body["2018-05-15"]["404"].length
				).toBe(2);
				expect(res.body["2018-05-15"]["200"][0]["status"]).toBe(200);
				expect(res.body["2018-05-15"]["404"][0]["status"]).toBe(404);
				done();
			})
			.catch(e => {
				console.log(e);
				done(e);
			});
	});

	it("should order documents by ip", done => {
        const ip = "185.92.73.106";
		request(app)
			.get("/findByDate/2018-05-15/ip")
			.expect(200)
			.expect(res => {
				expect(res.body["2018-05-15"]['185.92.73.106']).toBeTruthy();
				done();
			})
			.catch(e => {
				console.log(e);
                done(e);
            });
	});

	it("should fail if provided with multiple dates", done => {
		request(app)
			.get("/findByDate/2018-05-15&2018-05-16")
			.expect(400)
			.end(done);
    });
});


describe("GET /findByDates/", () => {
    it('should get all 3 documents', done =>{
        request(app).get("/findByDates/2018-01-01&2020-01-01").expect(200).expect(res=>{
            console.log(res.body);
            expect(res.body['2018-05-15'].length + res.body['2019-05-15'].length).toBe(3);
            done();
        }).catch(e=>{
            console.log(e);
            done(e);
        });
    })

    it("should order documents by status", done => {
		request(app)
			.get("/findByDates/2018-05-15&2018-05-16/status")
			.expect(200)
			.expect(res => {
				expect(
					res.body["2018-05-15"]["200"].length +
						res.body["2018-05-15"]["404"].length
				).toBe(2);
				expect(res.body["2018-05-15"]["200"][0]["status"]).toBe(200);
				expect(res.body["2018-05-15"]["404"][0]["status"]).toBe(404);
				done();
			})
			.catch(e => {
				console.log(e);
				done(e);
			});
	});

	it("should order documents by ip", done => {
        const ip = "185.92.73.106";
		request(app)
			.get("/findByDates/2018-05-15&2018-05-16/ip")
			.expect(200)
			.expect(res => {
				expect(res.body["2018-05-15"]['185.92.73.106']).toBeTruthy();
				done();
			})
			.catch(e => {
				console.log(e);
                done(e);
            });
	});

	it("should fail if provided with multiple dates", done => {
		request(app)
			.get("/findByDates/2018-05-15")
			.expect(400)
			.end(done);
    });
})
