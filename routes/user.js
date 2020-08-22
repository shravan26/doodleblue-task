const express = require('express');
const router = express.Router();
const {getUserById} = require('../controllers/tasks');
const { isSignedIn, isAuthenticated } = require('../controllers/authentication');
const {getUserDetails} = require('../controllers/user');

//Param to fetch user by id
router.param('userId' , getUserById);

//Route to provide the userDetails
router.get('/:userId/getdetails',isSignedIn,isAuthenticated, getUserDetails);


module.exports = router;