const httpStatus = require('http-status')
const parseBearerToken = require('parse-bearer-token').default
const ApiError = require('../../helpers/ApiError')
const catchAsync = require('../../helpers/catchAsync')
const userService = require('../../services/user')

const auth = catchAsync(async (req, res, next) => {
  req.token = parseBearerToken(req)
  try {
    req.user = await userService.verifyToken(req.token)
    if(req.user) return next()
  } catch(e) {}
  next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'))
})

module.exports = auth
