const bcrypt = require('bcryptjs')
const moment = require('moment')
const sharp = require('sharp')
const User = require('../models/user')
const config = require('../config/config')
const randomStr = require('../helpers/rendomStr')
const storage = require('../helpers/storage')

const isUsernameTaken = async (username, excludeUserId) => {
  return !!(await User.findOne({ username, _id: { $ne: excludeUserId } }))
}

const hashPassword = (password) => {
  return bcrypt.hash(password, 8)
}

const checkPassword = (hash, password) => {
  return bcrypt.compare(password, hash)
}

const createToken = async (uid) => {
  const tokenExpiredAt = moment().add(config.jwt.expirationDays, 'days').valueOf()
  const token = randomStr(64)
  await User.findByIdAndUpdate(uid, { token, tokenExpiredAt })
  return token
}

const verifyToken = async (token) => {
  try {
    const user = await User.findOne({ token })
    if(moment(user.tokenExpiredAt).diff(moment())) {
      return user
    }
  } catch (e) {}
  return false
}

const createUser = async data => {
  data.password = await hashPassword(data.password)
  return User.create(data)
}

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username })
    if(user) return user
  } catch (e) {}
  return false
}

const updateUser = async (id, data) => {
  if(data.password) data.password = await hashPassword(data.password)
  await User.findByIdAndUpdate(id, data)
  return await User.findById(id)
}

const deleteAvatar = async (name) => {
  try {
    await storage.remove(storage.normalizeUrl(name))
  } catch (e) {}
  return true
}

const updateAvatar = async (id, buff, old) => {
  const name = 'avatar/' + randomStr(40) + '.jpg'
  await sharp(buff)
    .resize({width: 180, height: 180})
    .toFormat("jpeg")
    .toBuffer()
    .then(buffer => {
      return storage.save(name, buffer)
    })
  await User.findByIdAndUpdate(id, { avatar: storage.createUrl(name) })
  if(old) await deleteAvatar(old)
  return await User.findById(id)
}

module.exports = {
  isUsernameTaken,
  hashPassword,
  checkPassword,
  createToken,
  verifyToken,
  createUser,
  getUserByUsername,
  updateUser,
  updateAvatar
}
