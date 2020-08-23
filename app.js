const express = require('express');
const mongoose = require('mongoose');
require ('dotenv').config();
const app = express();
const cron = require('cron').CronJob;
const moment = require('moment');
const Task = require('./models/tasks');
const {sendEmail} = require('./email');

//Routes 
const authRoutes = require('./routes/authentication');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/user');
const expiredRoutes = require('./routes/expired');

//Middleware 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Expired = require('./models/expired');
const { CronJob } = require('cron');
const User = require('./models/user');

//Using the middleware 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Call the routes
app.use('/api',authRoutes);
app.use('/api',taskRoutes);
app.use('/api',userRoutes);
app.use('/api',expiredRoutes);

//Creating a scheduler to perform a function to delete users after expiry

const deleteUserTasks = () => {
    Task.find().exec((err,tasks) => {
        if(err) {
            console.log('Error Finding')
        }
        tasks.map(task => {
            if(moment().isSameOrAfter(task.expiry)){
                const expired = new Expired({
                    expiredTaskName : task.taskName,
                    expiredAt : moment()
                });
                expired.save((err,expiredResult) => {
                    if(err){
                        return console.log("Error While updating");
                    }
                    console.log(expiredResult);
                });
                    Task.deleteOne({_id : task._id}, (err) => {
                        if(err) return console.log("Error while erasing users " + err);
                        console.log("successfully erased data")
                    })
                }
            if(moment().isSameOrBefore(task.expiry)){
                return sendEmail;
            }
            })
        })
    
}


const job = new CronJob("*/10 * * * * *",() => {deleteUserTasks()});
job.start();


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