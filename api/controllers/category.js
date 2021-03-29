const httpStatus = require("http-status")
const ApiError = require("../../helpers/ApiError")
const postService = require('../../services/post')
const categoryService = require('../../services/category')
const catchAsync = require("../../helpers/catchAsync")

const fetch = catchAsync(async (req, res) => {
  res.json(await categoryService.fetch())
})

const posts = catchAsync(async (req, res, next) => {
  const slug = req.params.slug
  const skip = Number(req.query.skip) || 0
  const limit = Number(req.query.limit) || 10
  if(limit > 10) limit = 10

  const category = await categoryService.exists(slug)
  if(!category) return next(new ApiError(httpStatus.NOT_FOUND))
  const posts = await postService.fetch(skip, limit, { key: 'category', value: category.id })
  res.json(posts)
})

module.exports = {
  fetch,
  posts
}
