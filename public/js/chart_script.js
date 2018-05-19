class Chart_Prototype {
	constructor() {
		this.ChartObj = {
			labels: [],
			data: [],
			backgroundColor: [],
			borderColor: []
		};
		this.backgroundColor = [
			"rgba(255, 99, 132, 0.2)",
			"rgba(255, 159, 64, 0.2)",
			"rgba(255, 206, 86, 0.2)",
			"rgba(0, 128, 0, 0.2)",
			"rgba(111, 195, 251, 0.2)",
			"rgba(54, 162, 235, 0.2)",
			"rgba(153, 102, 255, 0.2)"
		];

		this.borderColor = [
			"rgba(255,99,132, 1)",
			"rgba(255, 159, 64, 1)",
			"rgba(255, 206, 86, 1)",
			"rgba(0, 128, 0, 1)",
			"rgba(111, 195, 251, 1)",
			"rgba(54, 162, 235, 1)",
			"rgba(153, 102, 255, 1)"
		];
		this.myChart;
	}

	removeChart() {
		this.myChart.destroy();
	}
}

class DailyChart extends Chart_Prototype {
	constructor() {
		super();
		this.today = moment().format("YYYY-MM-D");
		this.yesterday = moment()
			.add(-1, "days")
			.format("YYYY-MM-D");
		this.categories = ["ip", "status"];
		this.increment = 0;
		this.category = this.categories[this.increment % 2];

		this.change_category = this.change_category.bind(this);
		this.get_daily = this.get_daily.bind(this);
		this.get_daily();
	}

	change_category() {
		this.ChartObj = {
			labels: [],
			data: [],
			backgroundColor: [],
			borderColor: []
		};
		this.increment++;
		this.category = this.categories[this.increment % 2];
		this.get_daily();
	}

	get_daily() {
		$.ajax({
			type: "GET",
			url: `http://localhost:3000/findByDate/${this.today}/${this.category}`,
			success: function(response, textStatus, jqXHR) {
				if (jqXHR.status === 204) {
					$("#daily-chart-title").html(
						`Daily Requests for ${this.yesterday}`
					);
					console.log("backup");
					return backup_daily(category);
				}
				$("#daily-chart-title").html(`Daily Requests for ${this.today}`);
				var i = 0;
				for (var key in response[this.today]) {
					this.ChartObj.data.push(response[this.today][key].length);
					this.ChartObj.labels.push(key);
					this.ChartObj.backgroundColor.push(this.backgroundColor[i % 7]);
					this.ChartObj.borderColor.push(this.borderColor[i++ % 7]);
				}
				this.drawDailyChart();
			}.bind(this),
			error: function(e) {
				console.log(e);
			}
		});
	}

	backup_daily() {
		$.ajax({
			type: "GET",
			url: `http://localhost:3000/findByDate/${this.yesterday}/${
				this.category
			}`,
			success: function(response, textStatus, jqXHR) {
				if (jqXHR.status === 204) {
					return console.log("no content");
				}
				var i = 0;
				for (var key in response[this.yesterday]) {
					this.ChartObj.data.push(response[this.yesterday][key].length);
					this.ChartObj.labels.push(key);
					this.ChartObj.backgroundColor.push(this.backgroundColor[i % 7]);
					this.ChartObj.borderColor.push(this.borderColor[i++ % 7]);
				}
				this.drawDailyChart();
			}.bind(this),
			error: function(e) {
				console.log(e);
			}
		});
	}

	drawDailyChart() {
		var ctx = document.getElementById("daily_chart").getContext("2d");
		this.myChart = new Chart(ctx, {
			type: "doughnut",
			data: {
				labels: this.ChartObj.labels,
				datasets: [
					{
						label: "# of requests",
						data: this.ChartObj.data,
						backgroundColor: this.ChartObj.backgroundColor,
						borderColor: this.ChartObj.borderColor,
						borderWidth: 1
					}
				]
			},
			options: {
				scales: {
					yAxes: [
						{
							ticks: {
								beginAtZero: true
							}
						}
					]
				}
			}
		});
	}
}

class WeeklyChart extends Chart_Prototype {
	constructor() {
		super();
		this.today = moment().format("YYYY-MM-D");
		this.week_ago = moment(this.today)
			.add(-7, "days")
			.format("YYYY-MM-D");
		this.get_weekly = this.get_weekly.bind(this);
		this.get_weekly();
	}

	get_weekly() {
		$.ajax({
			type: "GET",
			url: `http://localhost:3000/findByDates/${this.week_ago}&${
				this.today
			}`,
			success: function(response) {
				var i = 0;
				for (var key in response) {
					this.ChartObj.data.push(response[key].length);
					this.ChartObj.labels.push(key);
					this.ChartObj.backgroundColor.push(this.backgroundColor[i % 7]);
					this.ChartObj.borderColor.push(this.borderColor[i++ % 7]);
				}
				this.drawWeeklyChart();
				drawTable(response);
			}.bind(this)
		});
	}

	drawWeeklyChart() {
		var ctx = document.getElementById("weekly_chart").getContext("2d");
		this.myChart = new Chart(ctx, {
			type: "bar",
			data: {
				labels: this.ChartObj.labels,
				datasets: [
					{
						label: "# of requests",
						data: this.ChartObj.data,
						backgroundColor: this.ChartObj.backgroundColor,
						borderColor: this.ChartObj.borderColor,
						borderWidth: 1
					}
				]
			},
			options: {
				scales: {
					yAxes: [
						{
							ticks: {
								beginAtZero: true
							}
						}
					]
				}
			}
		});
	}
}

let daily = new DailyChart();
let weekly = new WeeklyChart();

//nav to graph/tables
$(".nav-container li").click(function() {
	$(".nav-container li").removeClass("active");
	$(this).addClass("active");
});

//alternate between ip/status
$("#daily-chart-wrapper li").click(function() {
	if ($(this).hasClass("active") && !$(this).hasClass("inactive")) {
		return;
	}
	$("#daily-chart-wrapper .active")
		.removeClass("active")
		.addClass("inactive");
	$(this)
		.removeClass("inactive")
		.addClass("active");
	console.log("change category");
	daily.removeChart();
	daily.change_category();
});

function drawTable(data) {
    var combine_data = [];
    for(var data_from_day in data){
        combine_data = combine_data.concat(data[data_from_day]);
    }
	$("#myTable").DataTable({
		data: combine_data,
		columns: [
			{ data: "access date" },
			{ data: "ip" },
			{ data: "request" },
			{ data: "status" },
			{ data: "size" },
			{ data: "referrer" },
			{ data: "user agent" }
		]
	});
}