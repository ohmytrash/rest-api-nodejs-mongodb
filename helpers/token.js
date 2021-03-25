const jwt = require('jsonwebtoken')
const moment = require('moment')
const config = require('../config/config')

const generateToken = (sub) => {
  const expires = moment().add(config.jwt.expirationDays, 'days')
  const payload = {
    sub,
    iat: moment().unix(),
    exp: expires.unix(),
  }
  return jwt.sign(payload, config.jwt.secret)
}

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret)
}

module.exports = {
  generateToken,
  verifyToken
}
