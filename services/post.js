const slug = require('slug')
const Post = require('../models/post')
const categoryService = require('./category')

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
  return read(data.slug)
}

const update = async (data, id) => {
  data.slug = await generateSlug(data.title, id)
  data.category = (await categoryService.firstOrCreate(data.category)).id
  await Post.findByIdAndUpdate(id, data)
  return read(data.slug)
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

const fetch = async (skip, limit, user) => {
  try {
    let posts, total
    if(user) {
      [posts, total] = await Promise.all([
        await Post.find({ user })
          .sort('-createdAt')
          .skip(skip)
          .limit(limit),
        await Post.countDocuments({ user })
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
  return await Post.findByIdAndDelete(id)
}

module.exports = {
  create,
  update,
  exists,
  read,
  fetch,
  destroy
}
