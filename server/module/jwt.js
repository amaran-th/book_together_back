const randToken = require('rand-token')
const jwt = require('jsonwebtoken')
const secretKey = require('../../config/secretkey').secretKey
const options = require('../../config/secretkey').opeions
const TOKEN_EXPIRED = -3
const TOKEN_INVALID = -2

module.exports = {
  sign: async user => {
    const payload = {
      //token에 들어갈 실제 데이터(payload)
      userId: user.userId,
      pwd: user.pwd,
    }
    const result = {
      //sign 메소드를 통해 access token을 발급한다.
      token: jwt.sign(payload, secretKey, options),
      refreshToken: randToken.uid(256),
    }
    return result
  },
  verify: async token => {
    let decoded
    try {
      decoded = jwt.verify(token, secretKey)
    } catch (err) {
      if (err.message === 'jwt expired') {
        console.log('expired token')
        return TOKEN_EXPIRED
      } else if (err.message === 'invalid token') {
        console.log('inivalid token')
        console.log(TOKEN_INVALID)
        return TOKEN_INVALID
      } else {
        console.log('invalid token')
        return TOKEN_INVALID
      }
    }
    return decoded
  },
}
