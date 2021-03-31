const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const toJSON = require('./plugins/toJSON')

const { Schema } = mongoose

const chatSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
)

chatSchema.plugin(toJSON)
chatSchema.plugin(autopopulate)

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat
