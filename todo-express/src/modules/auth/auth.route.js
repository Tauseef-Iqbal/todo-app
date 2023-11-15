const { signUp, login, logout } = require('./auth.handler')

module.exports.authRoutes = {
  'post#/signup': signUp,
  'post#/login': login,
  'post#/logout': logout,
}
