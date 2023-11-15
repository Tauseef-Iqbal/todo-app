const Task = require('../../db/models/Task.model')

module.exports = class TasksController {
  async addTask(req, res) {
    const { title, body, completed } = req.body
    const userId = req.user.id
    const newTask = new Task({
      title,
      body,
      completed: completed ?? false,
      userId,
    })
    const addedTask = await newTask.save()
    return {
      message: 'Task added successfully',
      addedTask,
    }
  }

  async getAllTasks(req, res) {
    const foundTasks = await Task.find({
      userId: req.user.id,
    })
    if (foundTasks.length) {
      return {
        message: 'List of all the tasks',
        data: foundTasks,
      }
    }
  }

  async getATaskById(req, res) {
    const foundTask = await Task.findOne({
      userId: req.user.id,
      _id: req.params.id,
    })
    if (foundTask)
      return {
        foundTask,
      }
  }

  async updateTask(req, res) {
    const { id } = req.params
    const { title, body, completed = false } = req.body

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, body, completed },
      { new: true },
    )

    if (!updatedTask) {
      throw new Error('Task not found')
    }

    return {
      message: 'Task updated successfully',
      updatedTask,
    }
  }

  async deleteTask(req, res) {
    const { id } = req.params

    const deletedTask = await Task.findByIdAndDelete(id)
    if (!deletedTask) {
      throw new Error('Task not found')
    }

    return {
      message: 'Task deleted successfully',
      deletedTask,
    }
  }
}
