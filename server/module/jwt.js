const randToken = require('rand-token')
const jwt = require('jsonwebtoken')
const secretKey = require('../../config/secretkey').secretKey
const options = require('../../config/secretkey').option

//토큰 발급
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
}
