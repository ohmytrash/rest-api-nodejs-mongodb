const PubSub = require('pubsub-js')
const { NEW_COMMENT, DELETE_COMMENT } = require('../config/pubsub.types')

module.exports = (io) => {
  PubSub.subscribe(NEW_COMMENT, (msg, data) => {
    io.emit(NEW_COMMENT, data)
  })
  PubSub.subscribe(DELETE_COMMENT, (msg, data) => {
    io.emit(DELETE_COMMENT, data)
  })
}
