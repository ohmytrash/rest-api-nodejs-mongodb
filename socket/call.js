const PubSub = require('pubsub-js')
const { ONLINE_USER } = require('../config/pubsub.types')
const randomStr = require('../helpers/rendomStr')

let users = {}
const signals = {}

module.exports = (io) => {
  PubSub.subscribe(ONLINE_USER, (msg, data) => {
    users = data
  })
  io.on('connect', (socket) => {
    socket.on('CLEAR_SIGNAL', signalId => {
      if(signals[signalId]) {
        delete signals[signalId]
      }
    })
    socket.on('SIGNAL', (signalId, data) => {
      try {
        const targetId = signals[signalId].filter(item => item !== socket.id)[0]
        io.of("/").sockets.get(targetId).emit('SIGNAL', data)
      } catch (e) {
      }
    })
    socket.on('PING_SIGNAL', (signalId, cb) => {
      try {
        const targetId = signals[signalId].filter(item => item !== socket.id)[0]
        io.of("/").sockets.get(targetId).emit('PING_SIGNAL', (err) => {
          cb(err)
        })
      } catch (e) {
        console.log(e.message)
      }
    })
    socket.on('CALL', (target, cb) => {
      let user
      for(let uid in users) {
        users[uid].sockets.forEach(({ id }) => {
          if(id === socket.id) {
            user = users[uid]
          }
        })
        if(user) break;
      }
      if(user && users[target] && typeof cb === 'function') {
        let targetSocket
        users[target].sockets.forEach(item => {
          if(!item.away && io.of("/").sockets.get(item.id) && !targetSocket) {
            targetSocket = io.of("/").sockets.get(item.id)
          }
        })
        if(!targetSocket) {
          users[target].sockets.forEach(item => {
            if(io.of("/").sockets.get(item.id) && !targetSocket) {
              targetSocket = io.of("/").sockets.get(item.id)
            }
          })
        }
        if(!targetSocket) return cb("TARGET_OFFLINE") 
        const signalId = randomStr()
        signals[signalId] = [socket.id, targetSocket.id]
        targetSocket.emit('CALL', user, signalId, (err) => {
          let res
          if(err) {
            switch(err) {
              case 'REJECTED':
                res = 'Call rejected'
                break;
              case 'ON_CALLING':
                res = users[target].name + ' is on another call'
                break;
              case 'NO_RESPONSE':
                res = users[target].name + ' did not answer your call'
                break;
              default :
                res = 'Unable to connect with ' + users[target].name
                break;
            }
            return cb(res)
          }
          cb(null, users[target], signalId)
        })
      }
    })
  })
}
