const User = require('../models/user');
const Task = require('../models/tasks');

//creating a function to fetch the user id 
exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {
        if(err){
            return res.status(400).json({
                error : "User does not exist",
            })
        }
        req.profile = user;
        next();
    });
};

//creating a function to fetch the task id
exports.getTaskById = (req,res,next,id) => {
    Task.findById(id).exec((err,task) => {
        if(err) {
            return res.status(400).json({
                error : "There was an error fetching the task",
            })
        }
        req.task = task;
        next();
    })
}

//creating a task
exports.createNewTask = (req,res) => {
    const task = new Task(req.body);
    task.save((err,tasks) => {
        if(err){
            return res.status(400).json({
                error : "There was an error while creating the task"
            });
        }
        return User.findOneAndUpdate(
            {_id : req.profile._id},
            {$push: {tasks : tasks}},
            {new : true , useFindAndModify : false}
        ).then(function(userdet) {
            res.json(userdet);
        })
        .catch(function(err){
            res.json(err);
        })
    });
};

//updating a task 
exports.updateTask = (req,res) => {
    Task.findByIdAndUpdate(
        {_id : req.task._id},
        {$set : req.body},
        {new : true, useFindAndModify : false},
        (err,updatedTask) => {
            if(err ){
                res.status(400).json({
                    error : "Error while updating your task",
                })
            }
            return res.json(updatedTask);
        }
    ) 
};

//deleting the task
exports.deleteTask = (req,res) => {
    Task.findOneAndRemove({_id : req.task._id}, (err,tasks) => {
        if(err){
            return res.status(400).json({
                error : "Error deleting the task",
            })
        }
        return res.json({
            message : "deleted successfully"
        })
    })
}
//Getting all users tasks
exports.getAllTasks = (req,res) => {

    Task.find()
    .exec((err,tasks) => {
        if(err || !tasks){
            return res.status(400).json({
                error : "There are no new tasks addded by the users"
            })
        }
        return res.json(tasks); 
    })
}
