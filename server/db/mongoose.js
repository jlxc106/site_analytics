var mongoose = require('mongoose');

mongoose.Promise = global.Promise;  //enables promises for mongoose
//CONVERT TO mongoose.connect('mongodb://localhost:27017/portfolio');
// mongoose.connect('mongodb://localhost:27017/portfolio_test_cron');
// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === "production"){
    mongoose.connect(process.env.MONGODB_URI);
}else{
    // mongoose.connect('mongodb://heroku_xhbm9bwz:omfrnu55t3bfn1irkd9slg8r61@ds257848.mlab.com:57848/heroku_xhbm9bwz');
    mongoose.connect('mongodb://localhost:27017/portfolio');
}


module.exports = {
    mongoose
};

