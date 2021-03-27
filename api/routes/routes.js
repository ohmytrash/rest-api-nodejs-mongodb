const Router = require('express').Router()
const auth = require('../middlewares/auth')
const authValidation = require('../validators/auth')
const authController = require('../controllers/auth')
const postValidation = require('../validators/post')
const postController = require('../controllers/post')
const commentValidation = require('../validators/comment')
const commentController = require('../controllers/comment')
const userController = require('../controllers/user')

Router.post('/register', ...authValidation.register, authController.register)
Router.post('/login', ...authValidation.login, authController.login)
Router.put('/profile', auth, ...authValidation.updateProfile, authController.updateProfile)
Router.put('/profile/avatar', auth, authValidation.updateAvatar, authController.updateAvatar)
Router.get('/profile', auth, authController.profile)

Router.post('/posts', auth, ...postValidation.create, postController.create)
Router.put('/posts/:id', auth, ...postValidation.create, postController.update)
Router.get('/posts/:id', postController.read)
Router.get('/posts', postController.fetch)
Router.delete('/posts/:id', auth, postController.destroy)
Router.post('/posts/:id/favorite-toggle', auth, postController.favoriteToggle)

Router.get('/comment/:postid', commentController.fetch)
Router.post('/comment/:postid', auth, ...commentValidation.create, commentController.create)
Router.delete('/comment/:commentid', auth, commentController.destroy)

Router.get('/user/:username', userController.profile)

module.exports = Router
