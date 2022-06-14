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
      console.log(req?.headers?.token)
      req.decoded = jwt.verify(req?.headers?.token, secretKey)
      return next()
    } catch (err) {
      if (err.message === 'jwt expired') {
        return res
          .status(401)
          .json({ success: false, code: 401, msg: '토큰이 만료되었습니다' })
      } else if (err.message === 'invalid token') {
        return res
          .status(401)
          .json({ success: false, code: 401, msg: '유효하지 않은 토큰입니다' })
      } else {
        console.log('invalid token')
        return res
          .status(419)
          .json({ success: false, code: 419, msg: '잘못된 토큰입니다' })
      }
    }
  },
}
