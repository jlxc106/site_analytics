var mongoose = require('mongoose');

mongoose.Promise = global.Promise;  //enables promises for mongoose
//CONVERT TO mongoose.connect('mongodb://localhost:27017/portfolio');
// mongoose.connect('mongodb://localhost:27017/portfolio_test_cron');
mongoose.connect('mongodb://localhost:27017/portfolio');


module.exports = {
    mongoose
};

