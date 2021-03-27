const { checkSchema , validationResult} = require('express-validator');
const httpStatus = require('http-status');
const ApiError = require('../../helpers/ApiError');

const create = [
  checkSchema({
    title: {
      trim: true,
      isLength: {
        errorMessage: 'Title min 6 and max 100 characters',
        options: { min: 6, max: 100 },
      }
    },
    description: {
      trim: true,
      isLength: {
        errorMessage: 'Description min 20 and max 300 characters',
        options: { min: 20, max: 300 },
      }
    },
    body: {
      isLength: {
        errorMessage: 'Body min 20 and max 2500 characters',
        options: { min: 20, max: 2500 },
      }
    },
    category: {
      trim: true,
      isLength: {
        errorMessage: 'Category is required',
        options: { min: 1 },
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

const update = create

module.exports = {
  create,
  update
}
