const slug = require('slug')
const Post = require('../models/post')
const categoryService = require('./category')

const generateSlug = async title => {
  title = title.toLowerCase()
  let nslug = slug(title)
  let post, i = 0
  post = await Post.findOne({ slug: nslug })
  while(post) {
    i++
    nslug = slug(title) + '-' + i
    post = await Post.findOne({ slug: nslug })
  }
  return nslug
}

const create = async data => {
  data.slug = await generateSlug(data.title)
  data.category = (await categoryService.firstOrCreate(data.category)).id
  return await Post.create(data)
}

module.exports = {
  create
}
