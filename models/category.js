const mongoose = require('mongoose')
const toJSON = require('./plugins/toJSON')

const { Schema } = mongoose

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
  }
)

categorySchema.plugin(toJSON)

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
