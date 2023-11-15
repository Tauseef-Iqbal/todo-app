const { getUUID } = require('../../services/route.services')
const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
})
const Authorization = require('../../db/models/Authorization.model')

async function updateLastAccessTimestamp(userId, jwtId) {
  // upsert the jwtId into a record with current date/time (now) as the last access time.
  const now = new Date()
  await Authorization.findOneAndUpdate(
    { userId, jwtId },
    { $set: { lastAccessTimestamp: now } },
    { upsert: true, new: true },
  )
}

async function createJwt(userRecord) {
  const jwtId = getUUID() // goes in the auth token (jwt) payload, and also used to update last access timestamp
  await updateLastAccessTimestamp(userRecord._id, jwtId)
  const authTokenPayload = {
    user: {
      id: userRecord._id,
      fullName: userRecord.fullName,
      email: userRecord.email,
    },
    jwtId: jwtId,
  }
  const accessTokenExpirationTimeInMs = 24 * 60 * 60
  const accessToken = jwt.sign(
    authTokenPayload,
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: accessTokenExpirationTimeInMs,
    },
  )
  return {
    accessToken,
    accessTokenExpirationTimeInMs,
  }
}

async function authTokenIsActive(userId, jwtId) {
  const lastAccessTimestamp = await getLastAccessTimestamp(userId, jwtId)
  if (lastAccessTimestamp === null) {
    return false
  }
  const nowInMs = Date.now()
  const authTokenLastModifiedTimeInMs = new Date(lastAccessTimestamp).getTime()
  const authTokenTTLInMs = 24 * 60 * 60
  // if last modified date/time + TTL date/time < now, then not active
  if (authTokenLastModifiedTimeInMs + authTokenTTLInMs * 1000 > nowInMs) {
    return true
  }
  // otherwise, no it's not active
  return false
}

async function getLastAccessTimestamp(userId, jwtId) {
  const authRecord = await Authorization.findOne({ userId, jwtId })
  if (authRecord !== null) {
    return authRecord.lastAccessTimestamp
  } else {
    return null
  }
}

module.exports = {
  updateLastAccessTimestamp,
  createJwt,
  authTokenIsActive,
  getLastAccessTimestamp,
}
