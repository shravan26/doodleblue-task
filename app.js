const express = require('express');
const mongoose = require('mongoose');
require ('dotenv').config();
const app = express();

//Routes 
const authRoutes = require('./routes/authentication');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/user');
//Middleware 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Using the middleware 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Call the routes
app.use('/api',authRoutes);
app.use('/api',taskRoutes);
app.use('/api',userRoutes);

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