const userService = require('../services/user')
const { ONLINE_USER } = require('../config/pubsub.types')

const users = {}

const imOnline = async (token, socketid) => {
  const user = await userService.verifyToken(token, 'username avatar')
  if(!user) return 0

  if(typeof users[user.id] == 'undefined') {
    users[user.id] = user.toJSON()
    users[user.id].sockets = []
  } else {
    const sockets = users[user.id].sockets
    users[user.id] = user.toJSON()
    users[user.id].sockets = sockets
  }

  if(!users[user.id].sockets.includes(socketid)) {
    users[user.id].sockets.push(socketid)
  }
}

const onDisconnect = async (socketid) => {
  let user
  for(let uid in users) {
    users[uid].sockets.forEach(id => {
      if(id === socketid) {
        user = users[uid]
      }
    })
    if(user) break;
  }

  if(user) {
    const index = users[user.id].sockets.indexOf(socketid)
    users[user.id].sockets.splice(index, 1)
    if(!users[user.id].sockets.length) {
      delete users[user.id]
    }
  }
}

module.exports = (io) => {
  const sendOnlineUsers = () => {
    const ress = {}
    for(let uid in users) {
      ress[uid] = {
        username: users[uid].username,
        avatar: users[uid].avatar,
      }
    }
    io.emit(ONLINE_USER, ress)
  }
  io.on('connect', (socket) => {
    sendOnlineUsers()
    socket.on('IM_ONLINE', (token) => {
      imOnline(String(token), socket.id).then(() => {
        sendOnlineUsers()
      })
    })
    socket.on('disconnect', () => {
      onDisconnect(socket.id).then(() => {
        sendOnlineUsers()
      })
    })
  })
}
