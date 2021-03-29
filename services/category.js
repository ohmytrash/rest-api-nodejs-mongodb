const slug = require('slug')
const Category = require("../models/category")

const firstOrCreate = async (title) => {
  title = title.toLowerCase()
  let category = await Category.findOne({ slug:  slug(title) })
  if(!category) {
    category = await Category.create({ title, slug: slug(title) })
  }
  return category
}

const exists = async slug => {
  try {
    return await Category.findOne({ slug })
  } catch (e) {
    return false
  }
}

const fetch = () => {
  return Category.find().sort('title')
}

module.exports = {
  firstOrCreate,
  exists,
  fetch
}
