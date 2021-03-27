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
      useFindAndModify: false,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expirationDays: process.env.JWT_EXPIRATION_DAYS,
  },
  googleCLoudKey: {
    "type": process.env.GC_TYPE || '',
    "project_id": process.env.GC_PROJECT_ID || '',
    "private_key_id": process.env.GC_PRIVATE_KEY_ID || '',
    "private_key": process.env.GC_PRIVATE_KEY ? process.env.GC_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    "client_email": process.env.GC_CLIENT_EMAIL || '',
    "client_id": process.env.GC_CLIENT_ID || '',
    "auth_uri": process.env.GC_AUTH_URI || '',
    "token_uri": process.env.GC_TOKEN_URI || '',
    "auth_provider_x509_cert_url": process.env.GC_AUTH_PROVIDER_X509_CERT_URL || '',
    "client_x509_cert_url": process.env.GC_CLIENT_X509_CERT_URL
  }
}
