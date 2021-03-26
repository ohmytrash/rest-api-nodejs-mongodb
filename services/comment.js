const Comment = require("../models/comment")

const create = async data => {
  const comment = await Comment.create(data)
  return await Comment.findById(comment.id).populate('user')
}

const destroy = async id => {
  try {
    await Comment.findByIdAndDelete(id)
  } catch (e) {
    return false
  }
  return true
}

const fetch = async id => {
  return await Comment.find({ post: id }).populate('user')
}

const exists = async (_id, user) => {
  try {
    if(user) {
      return await Comment.count().and([{ _id }, { user }])
    }
    return await Comment.count({_id})
  } catch (e) {
    return false
  }
}

module.exports = {
  create,
  destroy,
  fetch,
  exists
}
