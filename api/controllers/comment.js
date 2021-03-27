const httpStatus = require("http-status")
const ApiError = require("../../helpers/ApiError")
const postService = require('../../services/post')
const commentService = require('../../services/comment')
const catchAsync = require("../../helpers/catchAsync")

const create = catchAsync(async (req, res, next) => {
  const id = req.params.postid
  if(!(await postService.exists(id))) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Post not found'))
  }
  const data = {
    user: req.user.id,
    post: id,
    body: req.body.body,
  }
  res.json(await commentService.create(data))
})

const destroy = catchAsync(async (req, res, next) => {
  const id = req.params.commentid
  if(!(await commentService.exists(id, req.user.id))) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Comment not found'))
  }
  await commentService.destroy(id)
  res.end()
})

const fetch = catchAsync(async (req, res, next) => {
  const id = req.params.postid
  res.json(await commentService.fetch(id))
})

module.exports = {
  create,
  destroy,
  fetch
}
