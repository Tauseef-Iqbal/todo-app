const User = require('../db/models/User.model')
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt
require('dotenv').config()

module.exports = async function (passport) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
  }
  passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
      const user = await User.findOne({ _id: jwt_payload.user.id })
      if (!user) {
        return done(null, false)
      }
      const decodedData = {
        user,
        jwtId: jwt_payload.jwtId,
      }
      if (user) return done(null, decodedData)
      else return done(null, false)
    }),
  )
}
