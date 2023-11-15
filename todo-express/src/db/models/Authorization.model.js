const mongoose = require('mongoose')

const AuthorizationModel = mongoose.model(
  'Authorization',
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jwtId: { type: String, required: true, unique: true },
    lastAccessTimestamp: { type: Date, required: true },
  }),
)

module.exports = AuthorizationModel
