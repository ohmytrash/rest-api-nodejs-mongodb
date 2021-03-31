const mongoose = require('mongoose')
const Chat = require("../models/chat")

const clean = async () => {
  try {
    const chats = await Chat.find().select('message').sort('-createdAt').skip(150)
    await Chat.deleteMany({_id: {$in: chats.map(({_id}) => mongoose.Types.ObjectId(_id))}})
  } catch (e) {
    // console.log(e)
  }
}

const save = (user, message) => {
  clean()
  return Chat.create({ user, message })
}

const fetch = async () => {
  try {
    return await Chat.find().sort('createdAt').populate('user', 'name username avatar')
  } catch (e) {
    console.log(e)
    return []
  }
}

module.exports = {
  save,
  clean,
  fetch
}
