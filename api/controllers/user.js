const httpStatus = require("http-status")
const ApiError = require("../../helpers/ApiError")
const favoriteService = require('../../services/favorite')
const postService = require('../../services/post')
const userService = require('../../services/user')
const catchAsync = require("../../helpers/catchAsync")

const profile = catchAsync(async (req, res, next) => {
  const username = req.params.username
  const user = await userService.getUserByUsername(username);
  if(!user) return next(new ApiError(httpStatus.NOT_FOUND))
  res.json(user)
})

const posts = catchAsync(async (req, res, next) => {
  const username = req.params.username
  const skip = Number(req.query.skip) || 0
  const limit = Number(req.query.limit) || 10
  if(limit > 10) limit = 10

  const user = await userService.getUserByUsername(username)
  if(!user) return next(new ApiError(httpStatus.NOT_FOUND))
  const posts = await postService.fetch(skip, limit, user.id)
  res.json(posts)
})

const favorites = catchAsync(async (req, res, next) => {
  const username = req.params.username
  const skip = Number(req.query.skip) || 0
  const limit = Number(req.query.limit) || 10
  if(limit > 10) limit = 10

  const user = await userService.getUserByUsername(username);
  if(!user) return next(new ApiError(httpStatus.NOT_FOUND))
  const favorites = await favoriteService.fetch(user.id, { skip, limit })
  res.json(favorites)
})

module.exports = {
  profile,
  posts,
  favorites
}
