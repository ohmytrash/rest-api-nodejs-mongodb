const httpStatus = require("http-status")
const ApiError = require("../../helpers/ApiError")
const User = require("../../models/user")
const { generateToken } = require('../../helpers/token')

const register = async (req, res, next) => {
  try {
    const { username, name, password } = req.body
    if(await User.isUsernameTaken(username)) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Username already exists.'))
    }
    const user = await User.create({ username, name, password })
    res.json({user, token: generateToken(user.id)})
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if(user && await user.isPasswordMatch(password)) {
      return res.json({user, token: generateToken(user.id)})
    }
    next(new ApiError(httpStatus.BAD_REQUEST, 'Password and Username combination is invalid.'))
  } catch (e) {
    next(e)
  }
}

const profile = async (req, res, next) => {
  res.json({ user: req.user })
}

module.exports = {
  register,
  login,
  profile
}
