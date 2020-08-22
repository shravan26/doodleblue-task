const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {validationResult} = require('express-validator');


//Controller for Registering a user
exports.registerUser = (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg,
        })
    }    
    const user = new User(req.body);

    user.save((err,user) => {
        if(err || !user) {
            return res.status(400).json({
                error : "The information cannot be stored in the database",
            })
        }
        user.salt = undefined;
        user.encry_password = undefined;
        return res.json(user);
    })
}

//Controller for User Log in
exports.userSignIn = (req,res) => {
    const {email,password} = req.body;

    //Finding the user through email and password

    User.findOne({email},(err,user) => {
        if(err || !user) {
            return res.status(400).json({
                error : "The email does not exist",
            })
        }
        if(!user.authenticate(password)){
            return res.status(400).json({
                error : "The email and password do not match",
            })
        }

        //If the flow reaches here we can create a token for the user to be authenticated if necessary
    
        const token = jwt.sign({_id : user._id},process.env.SECRET);

        //Insert the token inside a cookie
        res.cookie("token",token,{expire: new Date() + 9999})
    
        //logging in the user with token
        const {_id,name,email,tasks,expired} = user;
        res.json({
            token,
            mesasge : "Successfully logged in",
            user : {_id,name,email,tasks,expired}
        })
    }) 
}

//Controller for User logout 
exports.userSignOut = (req,res) => {
    res.clearCookie("token");
    return res.json({
        message : "User successfully Logged out",
    })
}

//Access to protected routes 
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty : "auth",
    algorithms : ['HS256']
});

//custom Middleware for Authentication
exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error : "ACCESS DENIED !",
        })
    }
    next();
}