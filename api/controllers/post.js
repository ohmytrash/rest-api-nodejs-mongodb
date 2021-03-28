const httpStatus = require("http-status")
const ApiError = require("../../helpers/ApiError")
const postService = require('../../services/post')
const favoriteService = require('../../services/favorite')
const catchAsync = require("../../helpers/catchAsync")

const create = catchAsync(async (req, res) => {
  const data = {
    user: req.user.id,
    title: req.body.title,
    description: req.body.description,
    body: req.body.body,
    category: req.body.category,
  }
  const post = await postService.create(data)
  res.json(await postService.read(post.id))
})

const update = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const data = {
    title: req.body.title,
    description: req.body.description,
    body: req.body.body,
    category: req.body.category,
  }

  if(!(await postService.exists(id, req.user.id))) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Post not found'))
  }

  const updated = await postService.update(data, id)
  res.json(updated)
})

const read = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const post = await postService.read(id)
  if(post) {
    return res.json(post)
  }
  next(new ApiError(httpStatus.NOT_FOUND, 'Post not found'))
})

const fetch = catchAsync(async (req, res) => {
  const skip = Number(req.query.skip) || 0
  const limit = Number(req.query.limit) || 10
  if(limit > 10) limit = 10
  const posts = await postService.fetch(skip, limit)
  res.json(posts)
})

const destroy = catchAsync(async (req, res, next) => {
  const id = req.params.id
  if(!(await postService.exists(id, req.user.id))) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Post not found'))
  }
  await postService.destroy(id)
  res.end()
})

const favoriteToggle = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const post = await postService.exists(id)
  if(!post) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Post not found'))
  }
  res.json(await favoriteService.toggle(req.user.id, id))
})

module.exports = {
  create,
  update,
  read,
  fetch,
  destroy,
  favoriteToggle
}
