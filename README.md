# site_analytics

front end + db for [site_watch](https://github.com/jlxc106/site_watch)

Web application displaying apache logs for [my porfolio](https://www.jayclim.com) using charts & tables.

## API

### Find Logs from IP addresses
https://calm-anchorage-32075.herokuapp.com/findByIP/{ip}&[ip2]
ex. ["https://calm-anchorage-32075.herokuapp.com/findByIP/195.22.127.231"](https://calm-anchorage-32075.herokuapp.com/findByIP/195.22.127.231)
    [ip2] is an optional parameter for querying by multiple ip addresses

### Find Logs from single date
https://calm-anchorage-32075.herokuapp.com/findByDate/{date}
ex. ["https://calm-anchorage-32075.herokuapp.com/findByDate/2018-05-16"](https://calm-anchorage-32075.herokuapp.com/findByDate/2018-05-16)


### Find Logs from single date organized by ip/network status
https://calm-anchorage-32075.herokuapp.com/findByDate/{date}/{ip/status}
ex. ["https://calm-anchorage-32075.herokuapp.com/findByDate/2018-05-16/ip"](https://calm-anchorage-32075.herokuapp.com/findByDate/2018-05-16/ip),
    ["https://calm-anchorage-32075.herokuapp.com/findByDate/2018-05-16/status"](https://calm-anchorage-32075.herokuapp.com/findByDate/2018-05-16/status) 


### Find Logs between dates
https://calm-anchorage-32075.herokuapp.com/findByDates/{date1}&{date2}
ex. ["https://calm-anchorage-32075.herokuapp.com/findByDates/2018-05-16&2019-01-01"](https://calm-anchorage-32075.herokuapp.com/findByDates/2018-05-16&2019-01-01)


### Find Logs between dates organized by ip/network status
https://calm-anchorage-32075.herokuapp.com/findByDate/{date1}&{date2}/{ip/status}
ex. ["https://calm-anchorage-32075.herokuapp.com/findByDates/2018-05-16&2019-01-01/ip"](https://calm-anchorage-32075.herokuapp.com/findByDates/2018-05-16&2019-01-01/ip)


## Languages/Libraries used:
* [Chart.js](http://www.chartjs.org/)
* [DataTables](https://datatables.net/)
* [Moment.js](http://momentjs.com/)
* MongoDB/Mongoose
* Node.JS/Express
* Cronjob/Heroku Scheduler
