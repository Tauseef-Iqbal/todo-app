const TasksControllerClass = require('./tasks.controller')
const { validateIncomingData } = require('./tasks.validator')
const TasksController = new TasksControllerClass()

async function addTask(req, res) {
  await validateIncomingData(req, res)
  res.status(201).json(await TasksController.addTask(req))
}

async function getAllTasks(req, res) {
  res.status(200).json(await TasksController.getAllTasks(req, res))
}

async function getATaskById(req, res) {
  res.status(201).json(await TasksController.getATaskById(req, res))
}

async function updateTask(req, res) {
  await validateIncomingData(req, res)
  res.status(201).json(await TasksController.updateTask(req, res))
}

async function deleteTask(req, res) {
  res.status(201).json(await TasksController.deleteTask(req, res))
}

module.exports = {
  addTask,
  getAllTasks,
  getATaskById,
  updateTask,
  deleteTask,
}
