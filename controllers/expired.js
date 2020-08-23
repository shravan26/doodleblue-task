const Expired = require('../models/expired');

exports.getExpiredTasks = (req,res) => {
    Expired.find().exec((err,expiredTasks) => {
        if(err || !expiredTasks){
            return res.status(400).json({
                error : "There are no new tasks addded by the users"
            });
        }
        return res.json(expiredTasks); 
    });
}