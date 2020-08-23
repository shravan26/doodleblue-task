const mongoose = require('mongoose');
const moment = require('moment');

const expiredSchema = mongoose.Schema({
    expiredTaskName : {
        type : String,
        trim: true,
    },
    expiredAt : {
        type : Date,
        default : moment()
    }
},{timestamp : true});

module.exports = mongoose.model('Expired', expiredSchema);