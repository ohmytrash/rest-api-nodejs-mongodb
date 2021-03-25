const Router = require('express').Router()
const authValidation = require('../validators/auth')
const authController = require('../controllers/auth')
const auth = require('../middlewares/auth')

Router.post('/register', ...authValidation.register, authController.register)
Router.post('/login', ...authValidation.login, authController.login)
Router.get('/profile', auth, authController.profile)

module.exports = Router
