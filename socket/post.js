const PubSub = require('pubsub-js')
const { NEW_POST, UPDATE_POST, DELETE_POST } = require('../config/pubsub.types')

module.exports = (io) => {
  PubSub.subscribe(NEW_POST, (msg, data) => {
    console.log(data)
    io.emit(NEW_POST, data)
  })
  PubSub.subscribe(UPDATE_POST, (msg, data) => {
    io.emit(UPDATE_POST, data)
  })
  PubSub.subscribe(DELETE_POST, (msg, data) => {
    io.emit(DELETE_POST, data)
  })
}
