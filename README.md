# site_analytics

[Live Page](https://sitelogs.herokuapp.com)

Web application displaying apache logs for [my porfolio](https://www.jayclim.com) using charts & tables.

[Link](https://www.github.com/jlxc106/site_watch) to server side script to generate daily logs for web access.

Logs are updated everyday at 00:30 AM UTC (5:30 PM PST dst).

## API

### Find Logs from IP addresses
"https://<span></span>sitelogs.herokuapp.com/findByIP/{ip}&[ip2]"

[example](https://sitelogs.herokuapp.com/findByIP/195.22.127.231)

[ip2] is an optional parameter for querying by multiple ip addresses

### Find Logs from single date
"https://<span></span>sitelogs.herokuapp.com/findByDate/{date}"

[example](https://sitelogs.herokuapp.com/findByDate/2018-05-16)

### Find Logs from single date organized by ip/network status
https://<span></span>sitelogs.herokuapp.com/findByDate/{date}/{ip/status}

[ip example](https://sitelogs.herokuapp.com/findByDate/2018-05-16/ip),

[status example](https://sitelogs.herokuapp.com/findByDate/2018-05-16/status) 

### Find Logs between dates
https://<span></span>sitelogs.herokuapp.com/findByDates/{date1}&{date2}

[example](https://sitelogs.herokuapp.com/findByDates/2018-05-16&2019-01-01)

date2 must be a later date than date1

### Find Logs between dates organized by ip/network status
https://<span></span>sitelogs.herokuapp.com/findByDate/{date1}&{date2}/{ip/status}

[example](https://sitelogs.herokuapp.com/findByDates/2018-05-16&2019-01-01/ip)

## Languages/Libraries used:
* [Chart.js](http://www.chartjs.org/)
* [DataTables](https://datatables.net/)
* [Moment.js](http://momentjs.com/)
* MongoDB/Mongoose
* Node.JS/Express
* Cronjob/Heroku Scheduler