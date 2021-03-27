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
    const user = await User.create({ username, name, password: await User.hashPassword(password) })
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
  res.json({ user: req.user, token: req.token })
}

const updateProfile = async (req, res, next) => {
  const { name, username, new_password, password } = req.body
  const data = { name, username }
  try {
    if(await User.isUsernameTaken(username, req.user.id)) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Username already exists.'))
    }
    if(new_password) {
      if(await req.user.isPasswordMatch(password)) {
        data.password = await User.hashPassword(new_password)
      } else {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'Password is invalid.'))
      }
    }
    await User.findByIdAndUpdate(req.user.id, data)
    res.json({ user: await User.findById(req.user.id) })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  register,
  login,
  profile,
  updateProfile
}
