let nodemailer = require('nodemailer');
const cron = require('node-cron');
let constants = require('./constant');


var transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : "shravan2406@gmail.com",
        pass : constants.pass,
    }
});

const mailOptions = {
    from : "shravan2406@gmail.com",
    to : "lorddabura09@gmail.com",
    subject : "Hi",
    html : "<h1>Please Complete your Task soon/h1>"
}

exports.sendEmail = transporter.sendMail(mailOptions,(err,info)=>{
    if(err){
        console.log(err);
    }
    console.log("Email Sent: " + info.response)
})
