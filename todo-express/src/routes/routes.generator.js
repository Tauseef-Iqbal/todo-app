const { errorsToResponse } = require('../services/route.services')
let { authenticate } = require('../../src/middlewares/authenticate')

const routePrefix = '/api/v1/'

async function createRoutes(app, routes) {
  await createStandardRoutes(app, routes)
}

async function createStandardRoutes(app, routes) {
  // We define the standard REST APIs for each route (if they exist).
  for (const [routeName, routeController] of Object.entries(routes)) {
    const [, routesOfSingleRouter] = Object.entries(routeController)[0]
    for (const route in routesOfSingleRouter) {
      const [method, path] = route.split('#')
      app[`${method}`](
        routePrefix + routeName + `${path}`,
        authenticate,
        async (req, res, next) => {
          try {
            await routesOfSingleRouter[`${route}`].call(this, req, res)
            next()
          } catch (err) {
            res.status(err.status || 400).json(errorsToResponse(err))
          }
        },
      )
    }
  }
}

module.exports = { createRoutes }
