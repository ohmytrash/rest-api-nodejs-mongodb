const PubSub = require('pubsub-js')
const Comment = require("../models/comment")
const { NEW_COMMENT, DELETE_COMMENT } = require('../config/pubsub.types')

const create = async data => {
  const comment = await Comment.create(data)
  await PubSub.publish(NEW_COMMENT, comment.toJSON())
  return comment
}

const destroy = async id => {
  try {
    await Comment.findByIdAndDelete(id)
    await PubSub.publish(DELETE_COMMENT, id)
  } catch (e) {
    return false
  }
  return true
}

const fetch = async id => {
  return await Comment.find({ post: id }).populate('user').sort('-createdAt')
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
