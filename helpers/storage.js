const { Storage } = require('@google-cloud/storage')
const config = require('../config/config')

const storage = new Storage({
  credentials: config.googleCLoudKey,
  projectId: config.googleCLoudKey.project_id,
})

const bucket = storage.bucket(process.env.GC_BUCKET_NAME || '')

module.exports = {
  save: (name, buffer, metadata = { contentType: 'image/jpeg' }) => bucket
    .file(name)
    .save(buffer, { metadata })
    .then(() => bucket.file(name).makePublic()),
  remove: name => bucket.file(name).delete(),
  exists: name => bucket.file(name).exists(),
  createUrl: name => `https://storage.googleapis.com/${bucket.name}/${name}`,
  normalizeUrl: url => url.replace(`https://storage.googleapis.com/${bucket.name}/`, '')
}
