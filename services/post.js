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
  return await Post.create(data)
}

const update = async (data, id) => {
  data.slug = await generateSlug(data.title, id)
  data.category = (await categoryService.firstOrCreate(data.category)).id
  return await Post.findByIdAndUpdate(id, data)
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

const read = async _id => {
  try {
    return await Post.findOne({_id}).populate(['category', 'user'])
  } catch (e) {
    return false
  }
}

module.exports = {
  create,
  update,
  exists,
  read
}
