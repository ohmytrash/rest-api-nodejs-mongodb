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

module.exports = {
  firstOrCreate
}
