const socketio = require('socket.io')

module.exports = server => {
  const options = {
    cors: { origin: "*", methods: "*" }
  }

  const io = socketio(server, options)

  require('./comment')(io)
  require('./post')(io)
  require('./online')(io)
  require('./call')(io)
}
