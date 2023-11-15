const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../../../.env'),
})
const { hash } = require('../../dev/dev-utilities/encryption')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { createJwt } = require('./auth.service')
const User = require('../../db/models/User.model')
const Authorization = require('../../db/models/Authorization.model')

module.exports = class AuthController {
  async signUp(req, res) {
    const { username, email, password } = req.body

    try {
      if (!validator.isEmail(email)) {
        throw new Error('Please enter a valid email')
      }
      if (!validator.isStrongPassword(password)) {
        throw new Error('Please enter a strong password')
      }
      // Check if the user is already existing
      const existedUser = await User.findOne({ email })

      if (existedUser)
        throw new Error('User already exists with the provided email')

      const userToAdd = {
        username,
        email,
        salt: crypto.randomBytes(16).toString('utf8'),
        authSecret: jwt.sign(
          {
            email,
          },
          process.env.ACCESS_TOKEN_SECRET_KEY,
          {
            expiresIn: '24h',
          },
        ),
      }
      userToAdd.passwordHash = await hash(password, userToAdd.salt)

      const newUser = new User(userToAdd)
      const registeredUser = await newUser.save()

      return {
        message: 'Your account has been registered successfully!',
        registeredUser,
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async login(req, res) {
    const { email, password } = req.body

    try {
      if (!email || !password) {
        throw new Error('Please provide the correct credentials')
      }

      if (!validator.isEmail(email)) {
        throw new Error('Please enter a valid email')
      }

      let foundUser = await User.findOne({ email })
      if (!foundUser) {
        throw new Error('User does not exist with the provided credentials')
      }

      foundUser = foundUser.toObject()

      const userPasswordHash = foundUser.passwordHash
      const loginPasswordHash = await hash(password, foundUser.salt)
      const passwordMatches = userPasswordHash === loginPasswordHash

      if (passwordMatches) {
        const tokenWithExpiry = await createJwt(foundUser)

        foundUser.accessToken = tokenWithExpiry.accessToken
        foundUser.accessTokenExpirationTimeInMs =
          tokenWithExpiry.accessTokenExpirationTimeInMs

        delete foundUser.passwordHash
        return { userRecord: foundUser }
      } else {
        throw new Error('Invalid login credentials.')
      }
    } catch (error) {
      console.log('error while logging in', error)
      throw error
    }
  }

  async logout(req, res) {
    try {
      const userId = req.user.id
      const jwtId = req.auth.jwtId
      const fon = await Authorization.findOne({ userId, jwtId })

      // Delete the Authorization document based on conditions
      const result = await Authorization.deleteOne({
        userId,
        jwtId,
      })

      if (result.deletedCount > 0) {
        return { message: 'Successfully logged out!' }
      } else {
        return { message: 'You are already logged out' }
      }
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }
}
