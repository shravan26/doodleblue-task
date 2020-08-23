const express = require('express');
const router = express.Router();
const {getUserById} = require('../controllers/tasks');
const {isSignedIn, isAuthenticated } = require('../controllers/authentication');
const {getExpiredTasks} = require('../controllers/expired');

//Param to fetch user by id
router.param('userId' , getUserById);

//Route to provide the ExpiredTasks
router.get('/:userId/expiredtasks',isSignedIn,isAuthenticated, getExpiredTasks);


module.exports = router;