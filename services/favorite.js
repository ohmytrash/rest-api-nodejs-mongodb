const Favorite = require('../models/favorite')

const add = async (user, post) => {
  return Favorite.create({ user, post })
}

const remove = async (user, post) => {
  return Favorite.findOneAndDelete({ user, post })
}

const isFavorited = async (user, post) => {
  return Favorite.findOne({ user, post })
}

const toggle = async (user, post) => {
  if(await isFavorited(user, post)) {
    await remove(user, post)
    return false
  }
  return await add(user, post)
}

const fetch = async (user, withPost) => {
  if(withPost) {
      const [favorites, total] = await Promise.all([
        await Favorite.find({ user })
          .populate('post')
          .sort('-createdAt')
          .skip(withPost.skip)
          .limit(withPost.limit),
        await Favorite.countDocuments({ user })
      ])
      return { favorites, total }
  }
  return Favorite.find({ user }).sort('-createdAt')
}

module.exports = {
  add,
  remove,
  isFavorited,
  toggle,
  fetch
}
