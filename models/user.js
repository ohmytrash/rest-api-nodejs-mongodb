const mongoose = require('mongoose')
const toJSON = require('./plugins/toJSON')

const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 250
    },
    avatar: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true,
    },
    token: {
      type: String,
      private: true
    },
    tokenExpiredAt: {
      type: Date,
      private: true
    },
  },
  {
    timestamps: true,
  }
)

userSchema.plugin(toJSON)

const User = mongoose.model('User', userSchema)

module.exports = User
