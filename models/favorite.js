const mongoose = require('mongoose')
const toJSON = require('./plugins/toJSON')

const { Schema } = mongoose

const favoriteSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    post: {
      type: Schema.ObjectId,
      ref: 'Post'
    },
    createdAt: {
      type: Date, 
      default: Date.now
    }
  }
)

favoriteSchema.plugin(toJSON)

const Favorite = mongoose.model('Favorite', favoriteSchema)

module.exports = Favorite
