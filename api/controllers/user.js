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
  const favorites = await favoriteService.fetch(user.id, true)
  const posts = await postService.fetchUserPost(user.id)
  res.json({ user, favorites, posts })
})

module.exports = {
  profile
}
