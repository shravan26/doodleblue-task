const mongoose = require('mongoose');

const expiredSchema = mongoose.Schema({
    expired : {
        type : Array,
        default : [],
    }
},{timestamp : true});

module.exports = mongoose.model('Completed', expiredSchema);