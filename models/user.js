const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const toJSON = require('./plugins/toJSON')

const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
  },
  {
    timestamps: true,
  }
)

userSchema.plugin(toJSON)

userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } })
  return !!user
}

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 8)
}

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this
  console.log(password, user.password)
  return bcrypt.compare(password, user.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
