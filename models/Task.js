const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text: String,
  category: String,
  priority: String,
  completed: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", TaskSchema);