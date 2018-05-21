var mongoose = require('mongoose');

var Logs = mongoose.model(`logs`, {
    ip:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    "access date": {
        type: Date,
        default: 0
    },
    request: {
        type: String,
        default: 'error has occured'
    },
    status: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        default: 0
    },
    referrer: {
        type: String,
        default: 'error has occured'
    },
    "user agent":{
        type: String,
        default: 'error has occured'
    }
})

module.exports = {Logs};