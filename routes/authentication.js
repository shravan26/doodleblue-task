const express = require('express');
const router = express.Router();
const  {registerUser,userSignIn,userSignOut} = require('../controllers/authentication');
const { body } = require('express-validator');
const {getUserById} = require('../controllers/tasks');

//Getting userId param
router.param('userId',getUserById);

//Register Route
router.post('/register',[
    body('email').isEmail().withMessage("Email should be valid"),
    body('password').isLength({min : 8}).withMessage("The Password should be atleast 8 characters")
]
,registerUser);
//Sign In Route
router.post('/signin',userSignIn);
//Sign Out Route
router.get('/signout',userSignOut);
module.exports = router;