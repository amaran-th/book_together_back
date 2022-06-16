const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt')
const bcrypt = require('bcrypt')

const secretKey = require('../../config/secretkey').secretKey
const db = require('../module/database')()

//인증 관련(아이디/비번 비교)
const passportConfig = { usernameField: 'userId', passwordField: 'pwd' }
const passportVerify = async (userId, pwd, next) => {
  try {
    db.getUserById({ userId }, null, async (error, user) => {
      if (!user) {
        next(null, false, {
          success: false,
          msg: '존재하지 않는 사용자 입니다.',
        })
        return
      }
      const compareResult = await bcrypt.compare(pwd, user.pwd)
      if (compareResult) {
        next(null, user)
        return
      }
      next(null, false, {
        success: false,
        msg: '올바르지 않은 비밀번호 입니다.',
      })
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//JWT 인증(verify) 관련
const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromHeader('token'),
  secretOrKey: secretKey,
}
const JWTVerify = async (jwtPayload, next) => {
  try {
    db.getUserById({ userId: jwtPayload.userId }, null, async (error, user) => {
      if (user) {
        next(null, user)
        return
      }
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify))
  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify))
}
