const socketio = require('socket.io')

module.exports = server => {
  const options = {
    cors: { origin: "*", methods: "*" }
  }

  const io = socketio(server, options)

  require('./comment')(io.of('/comments'))
}
