const httpStatus = require('http-status')
const parseBearerToken = require('parse-bearer-token').default
const ApiError = require('../../helpers/ApiError')
const { verifyToken } = require('../../helpers/token')
const User = require('../../models/user')

const auth = async (req, res, next) => {
  try {
    req.token = parseBearerToken(req)
    const payload = verifyToken(req.token)
    req.user = await User.findById(payload.sub)
    if(req.user) return next() 
  } catch (e) {
  }
  next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'))
}

module.exports = auth
