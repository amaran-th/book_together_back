//token 인증 미들웨어
const jwt = require('../module/jwt')
const TOKEN_EXPIRED = -3
const TOKEN_INVALID = -2

const authUtil = {
  checkToken: async (req, res, next) => {
    var token = req.headers.token
    if (!token)
      //토큰이 없을 경우
      return res.json({ msg: '토큰이 없음!' })
    const user = await jwt.verify(token) //token decode
    if (user === TOKEN_EXPIRED)
      // 유효기간 만료
      return res.json({ msg: '유효기간이 만료된 토큰!' })

    if (user === TOKEN_INVALID)
      // 유효하지 않는 토큰
      return res.json({ msg: '유효하지 않은 토큰!' })
    if (user.userId === undefined)
      return res.json({ msg: '유저 아이디가 없음' })
    req.userId = user.userId
    next()
  },
}

module.exports = authUtil
