const randToken = require('rand-token')
const jwt = require('jsonwebtoken')
const req = require('express/lib/request')
const secretKey = require('../../config/secretkey').secretKey
const options = require('../../config/secretkey').option
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
  verify: async (req, res, next) => {
    try {
      console.log(req?.headers?.authorization)
      req.decoded = jwt.verify(req?.headers?.authorization, secretKey)
      return next()
    } catch (err) {
      if (err.message === 'jwt expired') {
        console.log('토큰 유효기간 초과')
        return res
          .status(419)
          .json({ code: 419, message: '토큰이 만료되었습니다' })
      } else if (err.message === 'invalid token') {
        console.log('유효하지 않은 토큰')
        return res
          .status(401)
          .json({ code: 401, message: '유효하지 않은 토큰입니다' })
        return TOKEN_INVALID
      } else {
        console.log('invalid token')
        return TOKEN_INVALID
      }
    }
  },
}
