const express = require('express')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize= require('express-mongo-sanitize')
const compression = require('compression')
const slowDown = require("express-slow-down")

const morgan = require('./config/morgan')

const app = express()

const speedLimiter = slowDown({
  windowMs: 8 * 60 * 1000,
  delayAfter: 100,
  delayMs: 500
})

app.enable("trust proxy")
app.use(speedLimiter)
app.use(morgan.successHandler)
app.use(morgan.errorHandler)
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(xss())
app.use(mongoSanitize())
app.use(compression())
app.use('/api', require('./api/routes'))

module.exports = app
