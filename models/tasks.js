const mongoose = require("mongoose");
const moment = require('moment');

const taskSchema = mongoose.Schema(
  {
    taskName: {
      type: String,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
    expiry: {
      type: Date,
      default : moment().add(1,'m')
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
