const httpStatus = require("http-status")
const ApiError = require("../../helpers/ApiError")
const catchAsync = require("../../helpers/catchAsync")
const userService = require('../../services/user')
const favoriteService = require('../../services/favorite')

const register = catchAsync(async (req, res) => {
  const { name, username, password } = req.body
  const user = await userService.createUser({ name, username, password })
  const token = await userService.createToken(user.id)
  const favorites = await favoriteService.fetch(user.id)
  res.json({ user, token, favorites })
})

const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body
  const user = await userService.getUserByUsername(username)
  if(user && await userService.checkPassword(user.password, password)) {
    const token = await userService.createToken(user.id)
    const favorites = await favoriteService.fetch(user.id)
    res.json({ user, token, favorites })
  }
  next(new ApiError(httpStatus.BAD_REQUEST, 'Password and Username combination is invalid.'))
})

const profile = catchAsync(async (req, res, next) => {
  const favorites = await favoriteService.fetch(req.user.id)
  res.json({ user: req.user, token: req.token, favorites })
})

const updateProfile = catchAsync(async (req, res, next) => {
  const { name, bio, username, new_password } = req.body
  const data = { name, bio, username }
  if(new_password) data.password = new_password
  const user = await userService.updateUser(req.user.id, data);
  res.json({ user })
})

const updateAvatar = catchAsync(async (req, res, next) => {
  const user = await userService.updateAvatar(req.user.id, req.files.image.data, req.user.avatar)
  res.json({ user })
})

module.exports = {
  register,
  login,
  profile,
  updateProfile,
  updateAvatar
}
