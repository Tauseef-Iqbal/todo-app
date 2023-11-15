const SimpleCrypto = require('simple-crypto-js').default
const CryptoJS = require('crypto-js')
require('dotenv').config()

async function encrypt(textToEncrypt, key) {
  key = key || process.env.ACCESS_TOKEN_SECRET_KEY
  const simpleCryptoInstance = new SimpleCrypto(key)
  const encryptedText = simpleCryptoInstance.encrypt(textToEncrypt)
  return encryptedText
}

async function decrypt(textToDecrypt, key) {
  try {
    key = key || process.env.ACCESS_TOKEN_SECRET_KEY
    const simpleCryptoInstance = new SimpleCrypto(key)
    const decryptedText = simpleCryptoInstance.decrypt(textToDecrypt)
    return decryptedText
  } catch (err) {
    return null
  }
}

async function hash(textToHash, salt) {
  salt = salt || ''
  return CryptoJS.SHA512(textToHash + salt).toString()
}

module.exports = { encrypt, decrypt, hash }
