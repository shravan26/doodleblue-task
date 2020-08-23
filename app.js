const express = require('express');
const mongoose = require('mongoose');
require ('dotenv').config();
const app = express();
const schedule = require('node-schedule');
const moment = require('moment');
const Task = require('./models/tasks');

//Routes 
const authRoutes = require('./routes/authentication');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/user');
//Middleware 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Expired = require('./models/expired');

//Using the middleware 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Call the routes
app.use('/api',authRoutes);
app.use('/api',taskRoutes);
app.use('/api',userRoutes);

//Creating a scheduler to perform a function to delete users after expiry

const deleteUsers = () => {
    let current = moment().subtract(Task.expiry,'minutes');
    current = moment().utc(current).format();
    Task.find().exec((err,tasks) => {
        if(err) {
            return res.status(400).json({
                error : "There was an error in moving data",
            })
        }
        tasks.map(task => {
            if(task.createdAt <= current){
                const expired = new Expired({
                    expiredTaskName : task.taskName,
                    expiredAt : moment()
                });
                expired.save((err,expiredResult) => {
                    if(err){
                        return res.status(400).json({
                            error : "error updating expired",
                        })
                    }
                    res.json(expiredResult);
                })
            }
        })
    Task.deleteMany({ createdAt: {$lte: current} }, (err) => {
        if(err) return console.log("Error while erasing users " + err);
        console.log("successfully erased data")
        })
    })
}

let rule = new schedule.RecurrenceRule();
rule.minute = schedule.Range(0,59,5); 

let j = schedule.scheduleJob(rule,function(){
    return deleteUsers();
})

//Connection to Database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true
}).then(() => {console.log("The Database is connected")});


//Server Creation
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`App is running at port : ${port}`)
});