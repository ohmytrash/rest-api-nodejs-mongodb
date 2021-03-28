const mongoose = require('mongoose')
const toJSON = require('./plugins/toJSON')
const autopopulate = require('mongoose-autopopulate')

const { Schema } = mongoose

const postSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      autopopulate: true
    },
    category: {
      type: Schema.ObjectId,
      ref: 'Category',
      autopopulate: true
    },
    title: {
      type: String,
      required: true,
      trim: true
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
      trim: true
    },
    body: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
)

postSchema.plugin(toJSON)
postSchema.plugin(autopopulate)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
