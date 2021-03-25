const { checkSchema , validationResult} = require('express-validator');
const httpStatus = require('http-status');
const ApiError = require('../../helpers/ApiError');

const register = [
  checkSchema({
    name: {
      trim: true,
      isLength: {
        errorMessage: 'Name min 3 characters',
        options: { min: 3 },
      },
      custom: {
        errorMessage: 'Invalid name format',
        options: val => val.match(/^(?!.*[ ]{2})[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
      }
    },
    username: {
      trim: true,
      toLowerCase: true,
      isLength: {
        errorMessage: 'Username min 6 characters',
        options: { min: 6 },
      },
      custom: {
        errorMessage: 'Invalid username format',
        options: val => val.match(/^(?![_.])(?!.*[_]{2})[a-z0-9_]+(?<![_])$/),
      }
    },
    password: {
      isLength: {
        errorMessage: 'Password min 6 characters',
        options: { min: 6 },
      }
    },
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(httpStatus.BAD_REQUEST, errors.array()[0].msg))
    }
    next();
  }
]

const login = [
  checkSchema({
    username: {
      trim: true,
      toLowerCase: true,
      isLength: {
        errorMessage: 'Username is required',
        options: { min: 1 },
      }
    },
    password: {
      isLength: {
        errorMessage: 'Password min is required',
        options: { min: 1 },
      }
    },
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
  register,
  login
}
