//packages
const express = require('express')

//local files
var {logs} = require('./../models/logs');


var port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res)=>{
    console.log('connected');
    res.send('hi');
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})