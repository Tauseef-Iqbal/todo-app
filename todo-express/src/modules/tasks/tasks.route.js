const {
  addTask,
  getAllTasks,
  getATaskById,
  updateTask,
  deleteTask,
} = require('./tasks.handler')

module.exports.TasksRoutes = {
  'post#': addTask,
  'get#': getAllTasks,
  'get#/:id': getATaskById,
  'put#/:id': updateTask,
  'delete#/:id': deleteTask,
}
