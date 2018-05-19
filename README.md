# site_analytics

Web application displaying apache logs for [my porfolio](https://www.jayclim.com) using charts & tables.

[Link](https://www.github.com/jlxc106/site_watch) to server side script to generate daily logs for web access

## API

### Find Logs from IP addresses
"https://<span></span>calm-anchorage-32075.herokuapp.com/findByIP/{ip}&[ip2]"

[example](https://calm-anchorage-32075.herokuapp.com/findByIP/195.22.127.231)

[ip2] is an optional parameter for querying by multiple ip addresses

### Find Logs from single date
"https://<span></span>calm-anchorage-32075.herokuapp.com/findByDate/{date}"

[example](https://calm-anchorage-32075.herokuapp.com/findByDate/2018-05-16)

### Find Logs from single date organized by ip/network status
https://<span></span>calm-anchorage-32075.herokuapp.com/findByDate/{date}/{ip/status}

[ip example](https://calm-anchorage-32075.herokuapp.com/findByDate/2018-05-16/ip),

[status example](https://calm-anchorage-32075.herokuapp.com/findByDate/2018-05-16/status) 

### Find Logs between dates
https://<span></span>calm-anchorage-32075.herokuapp.com/findByDates/{date1}&{date2}

[example](https://calm-anchorage-32075.herokuapp.com/findByDates/2018-05-16&2019-01-01)

date2 must be a later date than date1

### Find Logs between dates organized by ip/network status
https://<span></span>calm-anchorage-32075.herokuapp.com/findByDate/{date1}&{date2}/{ip/status}

[example](https://calm-anchorage-32075.herokuapp.com/findByDates/2018-05-16&2019-01-01/ip)

## Languages/Libraries used:
* [Chart.js](http://www.chartjs.org/)
* [DataTables](https://datatables.net/)
* [Moment.js](http://momentjs.com/)
* MongoDB/Mongoose
* Node.JS/Express
* Cronjob/Heroku Scheduler