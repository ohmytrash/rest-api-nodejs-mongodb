const httpStatus = require("http-status")
const ApiError = require("../../helpers/ApiError")
const postService = require('../../services/post')
const commentService = require('../../services/comment')

const create = async (req, res, next) => {
  const id = req.params.postid
  if(!(await postService.exists(id))) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Post not found'))
  }
  const data = {
    user: req.user.id,
    post: id,
    body: req.body.body,
  }
  try {
    res.json(await commentService.create(data))
  } catch (e) {
    next(e)
  }
}

const destroy = async (req, res, next) => {
  const id = req.params.commentid
  if(!(await commentService.exists(id, req.user.id))) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Comment not found'))
  }
  try {
    await commentService.destroy(id)
    res.end()
  } catch (e) {
    next(e)
  }
}

const fetch = async (req, res, next) => {
  const id = req.params.postid
  try {
    res.json(await commentService.fetch(id))
  } catch (e) {
    next(e)
  }
}

module.exports = {
  create,
  destroy,
  fetch
}
