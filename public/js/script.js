class Chart_Prototype {
  constructor() {
    this.ChartObj = {
      labels: [],
      data: [],
      backgroundColor: [],
      borderColor: []
    };
    this.backgroundColor = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(0, 128, 0, 0.2)',
      'rgba(111, 195, 251, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)'
    ];

    this.borderColor = [
      'rgba(255,99,132, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(0, 128, 0, 1)',
      'rgba(111, 195, 251, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(153, 102, 255, 1)'
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
    this.today = moment
      .utc()
      .subtract(1, 'day')
      .subtract(30, 'minutes')
      .format('YYYY-MM-DD');
    this.yesterday = moment(this.today)
      .subtract(1, 'days')
      .format('YYYY-MM-DD');
    this.categories = ['ip', 'status'];
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
      type: 'GET',
      url: `https://sitelogs.herokuapp.com/findByDate/${this.today}/${
        this.category
      }`,
      // url: `http://localhost:3000/findByDate/${this.today}/${this.category}`,
      success: function(response, textStatus, jqXHR) {
        if (jqXHR.status === 204) {
          $('#daily-chart-title').html(`Daily Requests for ${this.yesterday}`);
          return this.backup_daily(this.category);
        }
        $('#daily-chart-title').html(`Daily Requests for ${this.today}`);
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
      type: 'GET',
      url: `https://sitelogs.herokuapp.com/findByDate/${this.yesterday}/${
        this.category
      }`,
      // url: `http://localhost:3000/findByDate/${this.yesterday}/${this.category}`,
      success: function(response, textStatus, jqXHR) {
        if (jqXHR.status === 204) {
          return console.log('no content');
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
    var ctx = document.getElementById('daily_chart').getContext('2d');
    this.myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.ChartObj.labels,
        datasets: [
          {
            label: '# of requests',
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
    this.today = moment
      .utc()
      .subtract(1, 'day')
      .subtract(30, 'minutes')
      .format('YYYY-MM-DD');
    this.week_ago = moment(this.today)
      .subtract(6, 'days')
      .format('YYYY-MM-DD');
    this.get_weekly = this.get_weekly.bind(this);
	this.get_weekly();
	this.data;
  }

  get_weekly() {
    $.ajax({
      type: 'GET',
      url: `https://sitelogs.herokuapp.com/findByDates/${this.week_ago}&${
        this.today
      }`,
      // url: `http://localhost:3000/findByDates/${this.week_ago}&${this.today}`,
      success: function(response) {
        var i = 0;
        for (var key in response) {
          this.ChartObj.data.push(response[key].length);
          this.ChartObj.labels.push(key);
          this.ChartObj.backgroundColor.push(this.backgroundColor[i % 7]);
          this.ChartObj.borderColor.push(this.borderColor[i++ % 7]);
        }
        this.drawWeeklyChart();
        initTable(response, 1);
      }.bind(this)
    });
  }

  drawWeeklyChart() {
    var ctx = document.getElementById('weekly_chart').getContext('2d');
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.ChartObj.labels,
        datasets: [
          {
            label: '# of requests',
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

$(document).ready(function() {
  $('.sidenav').sidenav();
});

//nav to graph/tables
// $(".nav-container li").click(function() {
// 	$(".nav-container li").removeClass("active");
// 	$(this).addClass("active");
// });

//alternate between ip/status
$('#daily-chart-wrapper li').click(function() {
  if ($(this).hasClass('active') && !$(this).hasClass('inactive')) {
    return;
  }
  $('#daily-chart-wrapper .active')
    .removeClass('active')
    .addClass('inactive');
  $(this)
    .removeClass('inactive')
    .addClass('active');
  daily.removeChart();
  daily.change_category();
});

function initTable(data, page) {
  var upperBound = page*100;
  var lowerBound = upperBound - 100;
  var combine_data = [];
  for (var data_from_day in data) {
    combine_data = combine_data.concat(data[data_from_day]);
  }
  combine_data.forEach((document_data, index) => {
    document_data['access date'] = moment(document_data['access date']).format(
      'YYYY-MM-DD HH:mm:ss A'
    );
  });

  weekly.data = combine_data;
  for(var i=0; i<combine_data.length; i=i+100){
	var index = parseInt(i/100) + 1;
	if(index === 1){
		$("<li>").addClass('active disabled waves-effect waves-green').html(index).appendTo('#table-pagination');
	}
	else{
		$("<li>").addClass('waves-effect waves-green').html(index).appendTo('#table-pagination');
	}
  }
  $("#table-pagination li").click(function(e){
	// console.log(this);
	$('#table-pagination li').removeClass('active disabled');
	$(this).addClass('active disabled')
	renderTablePage(e.target.innerText);
  })
  renderTablePage(1);
}

function renderTablePage(page){
	var upperBound = page*100;
	var lowerBound = upperBound - 100;
	var tbody = $('tbody');
	tbody.empty();
	weekly.data.forEach(function(data_row, indexRow) {
		if (indexRow < upperBound && indexRow > lowerBound) {
		  var row = $('<tr>').appendTo(tbody);
		  $('<td>')
			.html(data_row['access date'])
			.appendTo(row);
		  $('<td>')
			.html(data_row['ip'])
			.appendTo(row);
		  $('<td>')
			.html(data_row['request'])
			.appendTo(row);
		  $('<td>')
			.html(data_row['status'])
			.appendTo(row);
		  $('<td>')
			.html(data_row['size'])
			.appendTo(row);
		}
	  });

}