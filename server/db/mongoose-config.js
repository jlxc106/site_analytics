var NODE_ENV  = process.env.NODE_ENV  || 'development';

if(NODE_ENV === 'development'){
    process.env.MONGODB_URI = 'mongodb://localhost:27017/portfolio'
}
else if(NODE_ENV === "test"){
    process.env.MONGODB_URI = 'mongodb://localhost:27017/portfolio_test'
}
