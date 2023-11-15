const mongoose = require('mongoose')

const taskModel = mongoose.model(
  'Task',
  new mongoose.Schema(
    {
      title: { type: String, required: [true, 'Title cannot be empty'] },
      body: { type: String, required: false },
      completed: { type: Boolean, required: false, default: false },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    { timestamps: true },
  ),
)
module.exports = taskModel
