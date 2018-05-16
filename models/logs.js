var mongoose = require('mongoose');


var logs = mongoose.model('logs', {
    ip:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    "access date": {
        type: Date,
        default: null
    },
    request: {
        type: String
    },
    status: {
        type: Number
    },
    size: {
        type: Number
    },
    referrer: {
        type: String

    },
    "user agent":{
        type: String

    }
})



module.exports = {logs};