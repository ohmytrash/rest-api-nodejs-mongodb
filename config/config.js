const path = require('path')
const normalizePort = require('normalize-port')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../.env') })

module.exports = {
  env: process.env.NODE_ENV,
  port: normalizePort(process.env.PORT || 3000),
  mongoose: {
    url: process.env.MONGODB_URL,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expirationDays: process.env.JWT_EXPIRATION_DAYS,
  },
}
