const User = require('../models/user');

exports.getUserDetails = (req,res) => {
    User.findOne({ _id: req.profile._id })
    .populate("tasks")
    .then(function(user) {
      // If we were able to successfully find a User with the given id, send it back to the client
      res.json(user);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
}