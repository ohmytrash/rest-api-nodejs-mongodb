const { checkSchema , validationResult} = require('express-validator');
const httpStatus = require('http-status');
const ApiError = require('../../helpers/ApiError');

const create = [
  checkSchema({
    body: {
      trim: true,
      isLength: {
        errorMessage: 'Body min 5 and max 300 characters',
        options: { min: 5, max: 300 },
      }
    }
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(httpStatus.BAD_REQUEST, errors.array()[0].msg))
    }
    next();
  }
]

module.exports = {
  create
}
