const mongoose = require('mongoose')
const toJSON = require('./plugins/toJSON')

const { Schema } = mongoose

const postSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    category: {
      type: Schema.ObjectId,
      ref: 'Category'
    },
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
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    body: {
      type: String,
      required: true,
      maxlength: 2000
    },
  },
  {
    timestamps: true,
  }
)

postSchema.plugin(toJSON)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
