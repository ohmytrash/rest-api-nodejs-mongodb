const express = require('express')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize= require('express-mongo-sanitize')
const compression = require('compression')

const morgan = require('./config/morgan')

const app = express()

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
