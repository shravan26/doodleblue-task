const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    taskName : {
        type : String,
        trim : true
    },
    
    completed : {
        type : Boolean,
        default : false,
    },
    expiry : {
        type : Number,
        default : 0,
    }
},{timestamps:true})

module.exports = mongoose.model('Task', taskSchema);