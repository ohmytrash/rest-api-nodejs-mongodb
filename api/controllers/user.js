const httpStatus = require("http-status")
const ApiError = require("../../helpers/ApiError")
const favoriteService = require('../../services/favorite')
const User = require("../../models/user")

const profile = async (req, res, next) => {
  const username = req.params.username
  try {
    const user = await User.findOne({ username });
    if(!user) return next(new ApiError(httpStatus.NOT_FOUND, 'User not found'))
    const favorites = await favoriteService.fetch(user.id)
    res.json({ user, favorites })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  profile
}