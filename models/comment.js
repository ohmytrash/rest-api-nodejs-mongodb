const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const toJSON = require('./plugins/toJSON')

const { Schema } = mongoose

const commentSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      autopopulate: true
    },
    post: {
      type: Schema.ObjectId,
      ref: 'Post'
    },
    body: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
)

commentSchema.plugin(toJSON)
commentSchema.plugin(autopopulate)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
