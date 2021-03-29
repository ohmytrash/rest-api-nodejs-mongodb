const Router = require('express').Router()
const cors = require('cors')
const fileUpload = require('express-fileupload')
const httpStatus = require('http-status')
const ApiError = require('../../helpers/ApiError')
const { errorHandler, errorConverter } = require('../middlewares/error')

Router.use(cors())
Router.options('*', cors())
Router.use(fileUpload())

Router.use((req, res, next) => {
  setTimeout(() => {
    next()
  }, 250)
})

Router.use(require('./routes'))

Router.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})
Router.use(errorConverter)
Router.use(errorHandler)

module.exports = Router
