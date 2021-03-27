const { checkSchema , validationResult} = require('express-validator')
const httpStatus = require('http-status')
const FileType = require('file-type');
const ApiError = require('../../helpers/ApiError')
const catchAsync = require('../../helpers/catchAsync')
const userService = require('../../services/user')

const register = [
  checkSchema({
    name: {
      trim: true,
      isLength: {
        errorMessage: 'Name min 3 and max 20 characters',
        options: { min: 3, max: 20 },
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
  catchAsync(async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new ApiError(httpStatus.BAD_REQUEST, errors.array()[0].msg))
    }
    if(await userService.isUsernameTaken(req.body.username)) {
      next(new ApiError(httpStatus.BAD_REQUEST, 'Username already exists.'))
    }
    next()
  })
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
        errorMessage: 'Password is required',
        options: { min: 1 },
      }
    },
  }),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new ApiError(httpStatus.BAD_REQUEST, errors.array()[0].msg))
    }
    next()
  }
]

const updateProfile = [
  checkSchema({
    name: {
      trim: true,
      isLength: {
        errorMessage: 'Name min 3 and max 20 characters',
        options: { min: 3, max: 20 },
      },
    },
    bio: {
      isLength: {
        errorMessage: 'Bio max 250 characters',
        options: { max: 250 },
      },
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
    new_password: {
      custom: {
        errorMessage: 'New password min 6 characters',
        options: (val) => {
          if(val && val.length < 6) {
            return false
          }
          return true
        },
      }
    },
    password: {
      custom: {
        errorMessage: 'Password is required',
        options: (val, { req }) => {
          if(req.body.new_password && !val) {
            return false
          }
          return true
        },
      }
    }
  }),
  catchAsync(async(req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new ApiError(httpStatus.BAD_REQUEST, errors.array()[0].msg))
    }
    if(await userService.isUsernameTaken(req.body.username, req.user.id)) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Username already exists.'))
    }
    if(req.body.new_password && !(await userService.checkPassword(req.user.password, req.body.password))) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Password is invalid.'))
    }
    next()
  })
]

const updateAvatar = catchAsync(async (req, res, next) => {
  const image = req.files.image || {}
  if(!image.data) return next(new ApiError(httpStatus.BAD_REQUEST, 'Image is required'))
  const mime = await FileType.fromBuffer(image.data)
  if(!['jpg', 'png', 'gif'].includes(mime.ext)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Image format must be [jpg, png, gif]'))
  }
  next()
})

module.exports = {
  register,
  login,
  updateProfile,
  updateAvatar
}
