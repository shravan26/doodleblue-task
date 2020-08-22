const express = require('express');
const router = express.Router();
const {getUserById,getTaskById,createNewTask,updateTask,deleteTask, pushTasksInUser, getUserDetails, getAllTasks} = require('../controllers/tasks');
const { isSignedIn, isAuthenticated } = require('../controllers/authentication');

//Getting the userid to verify that only user has privileged acccess
router.param('userId',getUserById);
router.param('taskId',getTaskById);

//Route to create a task
router.post('/:userId/addtask', isSignedIn,isAuthenticated,createNewTask);
//Route to update a task
router.put('/:userId/:taskId', isSignedIn,isAuthenticated,updateTask);
//Route to Delete a task
router.delete('/:userId/:taskId', isSignedIn,isAuthenticated,deleteTask);
//Route to get all the user tasks 
router.get('/:userId/tasks',isSignedIn,isAuthenticated,getAllTasks);
module.exports = router;