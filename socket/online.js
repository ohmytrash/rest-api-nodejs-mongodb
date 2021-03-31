const PubSub = require('pubsub-js')
const userService = require('../services/user')
const { ONLINE_USER } = require('../config/pubsub.types')

const users = {}

const imOnline = async (token, socketid, away) => {
  const user = await userService.verifyToken(token, 'name username avatar')
  if(!user) return 0

  if(typeof users[user.id] == 'undefined') {
    users[user.id] = user.toJSON()
    users[user.id].sockets = []
  } else {
    const sockets = users[user.id].sockets
    users[user.id] = user.toJSON()
    users[user.id].sockets = sockets
  }

  if(users[user.id].sockets.filter(item => item.id === socketid).length == 0) {
    users[user.id].sockets.push({ id: socketid, away })
  } else {
    const sockets = []
    users[user.id].sockets.forEach(item => {
      if(item.id === socketid) item.away = away
      sockets.push(item)
    })
    users[user.id].sockets = sockets
  }
}

const onDisconnect = async (socketid) => {
  let user
  for(let uid in users) {
    users[uid].sockets.forEach(({ id }) => {
      if(id === socketid) {
        user = users[uid]
      }
    })
    if(user) break;
  }

  if(user) {
    const index = users[user.id].sockets.map(({ id }) => id).indexOf(socketid)
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
        id: uid,
        name: users[uid].name,
        username: users[uid].username,
        avatar: users[uid].avatar,
        away: users[uid].sockets.map(({ away }) => away)
      }
    }
    io.emit(ONLINE_USER, ress)
    PubSub.publish(ONLINE_USER, users)
  }
  io.on('connect', (socket) => {
    sendOnlineUsers()
    socket.on('IM_ONLINE', (token) => {
      imOnline(String(token), socket.id, false).then(() => {
        sendOnlineUsers()
      })
    })
    socket.on('IM_AWAY', (token) => {
      imOnline(String(token), socket.id, true).then(() => {
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
