const slug = require('slug')
const PubSub = require('pubsub-js')
const Post = require('../models/post')
const categoryService = require('./category')
const { NEW_POST, UPDATE_POST, DELETE_POST } = require('../config/pubsub.types')

const generateSlug = async (title, excludeId) => {
  title = title.toLowerCase()
  let nslug = slug(title)
  let post, i = 0
  post = await Post.findOne({ slug: nslug, _id: { $ne: excludeId } })
  while(post) {
    i++
    nslug = slug(title) + '-' + i
    post = await Post.findOne({ slug: nslug, _id: { $ne: excludeId } })
  }
  return nslug
}

const create = async data => {
  data.slug = await generateSlug(data.title)
  data.category = (await categoryService.firstOrCreate(data.category)).id
  await Post.create(data)
  const post = await read(data.slug) 
  await PubSub.publish(NEW_POST, post.toJSON())
  return post
}

const update = async (data, id) => {
  data.slug = await generateSlug(data.title, id)
  data.category = (await categoryService.firstOrCreate(data.category)).id
  await Post.findByIdAndUpdate(id, data)
  const post = await read(data.slug)
  await PubSub.publish(UPDATE_POST, post.toJSON())
  return post
}

const exists = async (_id, user) => {
  try {
    if(user) {
      return await Post.count().and([{ _id }, { user }])
    }
    return await Post.count({_id})
  } catch (e) {
    return false
  }
}

const read = async slug => {
  try {
    return await Post.findOne({slug})
  } catch (e) {
    return false
  }
}

const fetch = async (skip, limit, {key, value} = { key: null, value: null }) => {
  try {
    let posts, total
    if(key && value) {
      [posts, total] = await Promise.all([
        await Post.find({ [key]: value })
          .sort('-createdAt')
          .skip(skip)
          .limit(limit),
        await Post.countDocuments({ [key]: value })
      ])
    } else {
      [posts, total] = await Promise.all([
        await Post.find()
          .sort('-createdAt')
          .skip(skip)
          .limit(limit),
        await Post.countDocuments()
      ])
    }
    return { posts, total }
  } catch (e) {
    return false
  }
}

const destroy = async id => {
  await Post.findByIdAndDelete(id)
  await PubSub.publish(DELETE_POST, id)
  return true
}

module.exports = {
  create,
  update,
  exists,
  read,
  fetch,
  destroy
}
