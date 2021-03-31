const userService = require('../services/user')
const chatService = require('../services/chat')

const onChat = async (message, token, cb) => {
  try {
    const user = await userService.verifyToken(token, 'name username')
    if(user) {
      const chat = await chatService.save(user.id, message)
      cb({
        username: user.username,
        name: user.name,
        createdAt: chat.createdAt,
        message: chat.message,
        id: chat.id
      })
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = (io) => {
  io.on('connect', (socket) => {
    socket.on('CHAT', (message, token, cb) => {
      onChat(message, token, (data) => {
        io.emit('CHAT', data)
      })
      cb()
    })
    socket.on('FETCH_CHAT', (cb) => {
      chatService.fetch().then(chats => {
        cb(chats.map((chat) => {
          return {
            username: chat.user.username,
            name: chat.user.name,
            createdAt: chat.createdAt,
            message: chat.message,
            id: chat.id
          }
        }))
      })
    })
  })
}
