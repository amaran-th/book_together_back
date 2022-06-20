require('dotenv').config()
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const { Strategy: KakaoStrategy } = require('passport-kakao')
const { Strategy: NaverStrategy } = require('passport-naver-v2')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt')
const bcrypt = require('bcrypt')

const secretKey = require('../../config/secretkey').secretKey
const db = require('../module/database')()

//인증 관련(아이디/비번 비교)
const passportConfig = { usernameField: 'userId', passwordField: 'pwd' }
const passportVerify = async (userId, pwd, next) => {
  try {
    db.getUserByIdNProvider(
      { userId, provider: 'local' },
      null,
      async (error, user) => {
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
      }
    )
  } catch (error) {
    console.error(error)
    next(error)
  }
}
//카카오 인증
const KakaoConfig = {
  clientID: process.env.KAKAO_ID,
  callbackURL: 'http://localhost:3002/auth/kakao/callback',
}
const KakaoVerify = async (accessToken, refreshToken, profile, next) => {
  try {
    db.getUserBySnsId(
      { snsId: profile.id, provider: profile.provider },
      null,
      async (error, user) => {
        if (user) {
          let data = {
            profile: user,
            accessToken: accessToken,
          }
          return next(null, data)
        } else {
          db.addSnsUser(
            {
              nickName: profile.displayName,
              userId: profile._json.kakao_account.email,
              email: profile._json.kakao_account.email,
              pwd: null,
              snsId: profile.id,
              provider: 'kakao',
            },
            null,
            async (error, newUser) => {
              let data = {
                profile: newUser,
                accessToken: accessToken,
              }
              return next(null, data)
            }
          )
        }
      }
    )
  } catch (error) {
    console.error(error)
    next(error)
  }
}

//구글 인증
const GoogleConfig = {
  clientID: process.env.GOOGLE_ID, // 구글 로그인에서 발급받은 REST API 키
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: 'http://localhost:3002/auth/google/callback',
  userProfile: 'https://www.googleapis.com/oauth2/userinfo',
}
const GoogleVerify = async (accessToken, refreshToken, profile, next) => {
  try {
    db.getUserBySnsId(
      { snsId: profile.id, provider: profile.provider },
      null,
      async (error, user) => {
        if (user) {
          let data = {
            profile: user,
            accessToken: accessToken,
          }
          return next(null, data)
        } else {
          db.addSnsUser(
            {
              nickName: profile.displayName,
              userId: profile.emails[0].value,
              email: profile.emails[0].value,
              pwd: null,
              snsId: profile.id,
              provider: 'google',
            },
            null,
            async (error, newUser) => {
              let data = {
                profile: newUser,
                accessToken: accessToken,
              }
              return next(null, data)
            }
          )
        }
      }
    )
  } catch (error) {
    console.error(error)
    next(error)
  }
}
//네이버 인증
const NaverConfig = {
  clientID: process.env.NAVER_ID, // 네이버 로그인에서 발급받은 REST API 키
  clientSecret: process.env.NAVER_SECRET,
  callbackURL: 'http://localhost:3002/auth/naver/callback',
}
const NaverVerify = async (accessToken, refreshToken, profile, next) => {
  try {
    db.getUserBySnsId(
      { snsId: profile.id, provider: profile.provider },
      null,
      async (error, user) => {
        if (user) {
          let data = {
            profile: user,
            accessToken: accessToken,
          }
          return next(null, data)
        } else {
          db.addSnsUser(
            {
              nickName: profile.name,
              userId: profile.email,
              email: profile.email,
              pwd: null,
              snsId: profile.id,
              provider: 'naver',
            },
            null,
            async (error, newUser) => {
              let data = {
                profile: newUser,
                accessToken: accessToken,
              }
              return next(null, data)
            }
          )
        }
      }
    )
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
    db.getUserByIdNProvider(
      { userId: jwtPayload.userId, provider: 'local' },
      null,
      async (error, user) => {
        if (user) {
          next(null, user)
          return
        }
      }
    )
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify))
  passport.use('kakao-login', new KakaoStrategy(KakaoConfig, KakaoVerify))
  passport.use('naver-login', new NaverStrategy(NaverConfig, NaverVerify))
  passport.use('google-login', new GoogleStrategy(GoogleConfig, GoogleVerify))
  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify))
}
