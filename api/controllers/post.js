const httpStatus = require("http-status")
const ApiError = require("../../helpers/ApiError")
const postService = require('../../services/post')

const create = async (req, res, next) => {
  const data = {
    user: req.user.id,
    title: req.body.title,
    description: req.body.description,
    body: req.body.body,
    category: req.body.category,
  }
  try {
    const post = await postService.create(data)
    res.json(post)
  } catch (e) {
    next(e)
  }
}

module.exports = {
  create
}
