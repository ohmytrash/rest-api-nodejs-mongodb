const Router = require('express').Router()
const auth = require('../middlewares/auth')
const authValidation = require('../validators/auth')
const authController = require('../controllers/auth')
const postValidation = require('../validators/post')
const postController = require('../controllers/post')

Router.post('/register', ...authValidation.register, authController.register)
Router.post('/login', ...authValidation.login, authController.login)
Router.put('/profile', auth, ...authValidation.updateProfile, authController.updateProfile)
Router.get('/profile', auth, authController.profile)

Router.post('/post', auth, ...postValidation.create, postController.create)
Router.put('/post/:id', auth, ...postValidation.create, postController.update)
Router.get('/post/:id', postController.read)
Router.get('/post', postController.fetch)
Router.delete('/post/:id', auth, postController.destroy)
Router.post('/post/:id/favorite-toggle', auth, postController.favoriteToggle)

module.exports = Router
