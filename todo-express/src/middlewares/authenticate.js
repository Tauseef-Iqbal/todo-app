const User = require('../db/models/User.model')
const passport = require('passport')
require('../configs/auth.config')(passport)
const { authTokenIsActive } = require('../modules/auth/auth.service')

module.exports.authenticate = async (req, res, next) => {
  if (
    !(
      req.path.endsWith('/login') ||
      req.path.endsWith('/signup') ||
      req.path.endsWith('/verify-account') ||
      req.path.endsWith('/forgot-password') ||
      req.path.endsWith('/reset-password')
    )
  ) {
    passport.authenticate('jwt', async function (err, decodedData) {
      if (err) return next(err)
      const { user, jwtId } = decodedData
      if (!user)
        return res
          .status(401)
          .json({ message: 'Unauthorized Access - Invalid Token' })

      const existedUser = await User.findOne({ _id: user.id })
      if (!existedUser)
        return res.status(401).json({
          message:
            'Unauthorized Access - User not found against this authentication token',
        })

      req.user = user
      req.auth = {}
      req.auth.jwtId = jwtId

      if (!req.path.endsWith('/logout')) {
        // but don't do all this if the route is /logout
        try {
          const isActive = await authTokenIsActive(user.id, jwtId)

          if (!isActive) {
            return res.status(401).json({ message: 'Inactive Token' })
          }
        } catch (error) {
          console.log(error)
          return next(error) // Forward the error to the error handler
        }
      }
      next()
    })(req, res, next)
  } else {
    next()
  }
}
