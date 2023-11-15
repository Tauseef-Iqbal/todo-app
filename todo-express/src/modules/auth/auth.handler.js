const AuthControllerClass = require('./auth.controller')
const { validateAgainstSchema } = require('../../services/validation.services')
const authDtos = require('./auth.validator')
const AuthController = new AuthControllerClass()

async function signUp(req, res) {
  validateAgainstSchema(req.body, authDtos.signUpDto, 'signup.post()')
  res.status(201).json(await AuthController.signUp(req, res))
}

async function login(req, res) {
  validateAgainstSchema(req.body, authDtos.loginDto, 'login.post()')
  res.status(200).json(await AuthController.login(req, res))
}

async function logout(req, res) {
  res.status(200).json(await AuthController.logout(req, res))
}

module.exports = {
  signUp,
  login,
  logout,
}
