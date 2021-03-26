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
    res.json(await postService.read(post.id))
  } catch (e) {
    next(e)
  }
}

const update = async (req, res, next) => {
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

  try {
    await postService.update(data, id)
    res.json(await postService.read(id))
  } catch (e) {
    next(e)
  }
}

const read = async (req, res, next) => {
  const id = req.params.id
  const post = await postService.read(id)
  if(post) {
    return res.json(post)
  }
  return next(new ApiError(httpStatus.NOT_FOUND, 'Post not found'))
}

module.exports = {
  create,
  update,
  read
}
