const express = require('express')
const { createRoutes } = require('./routes/routes.generator')
const { routes } = require('./routes/index')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const passport = require('passport')
require('../src/configs/auth.config')(passport)

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

// Catch unhandled exceptions
process.on('uncaughtException', (error) => {
  console.error('Unhandled Exception:', error)
  process.exit(1) // Optionally, you can exit the process or handle it differently
})

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason)
  process.exit(1) // Optionally, you can exit the process or handle it differently
})

app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({ extended: true }))
app.disable('etag')
// Create application routes
createRoutes(app, routes)

app.use((error, request, response, next) => {
  response.status(error.status || 400).json(error)
})

module.exports = app
