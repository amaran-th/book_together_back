var express = require('express')
var router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')

//local
var db = require('../module/database')()
const jwt = require('../module/jwt')

const check = user => {
  //TODO user 정보가 양식에 맞는지 확인하는 함수
  return true
}

//회원가입
//TODO check()함수는 에러 유형에 따라 에러 객체를 반환하고 라우터 콜백함수는 그 에러를 catch하는 구조르 짠다.
router.post('/signup', (req, res) => {
  if (check(req.query)) {
    db.getUserById(req.query, res, async (error, result) => {
      if (!result || result?.length === 0) {
        const { nickName, userId, email, pwd } = req.query
        bcrypt.hash(pwd, 12, (err, encrypted) => {
          console.log(encrypted)
          db.addUser(
            { nickName, userId, email, pwd: encrypted },
            res,
            async (error, result) => {
              res.send({ success: true, msg: '유저 추가 완료' })
            }
          )
        })
      } else {
        res.send({ success: false, msg: '이미 존재하는 유저입니다.' })
      }
    })
  } else {
    res.send({ success: false, msg: '양식을 다시 확인해주십시오.' })
  }
})

//회원탈퇴
router.delete(
  '/user',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    console.log(req.user.pwd, req.query.pwd)
    bcrypt.compare(req.query.pwd, req.user?.pwd, async (err, same) => {
      if (same) {
        try {
          db.removeUser(
            { userId: req.user?.userId },
            res,
            async (error, result) => {
              res.send({ success: true, msg: '유저 삭제 완료' })
            }
          )
        } catch (e) {
          console.error(e)
          res.send(e)
        }
      } else {
        res.send({ success: false, msg: '비밀번호가 올바르지 않습니다.' })
      }
    })
  }
)

//로그인
router.post('/signin', (req, res, next) => {
  try {
    //아이디/비번 비교
    passport.authenticate('local', (passportError, user, info) => {
      if (passportError || !user) {
        res.status(400).json({ msg: info.reason })
        return
      }
      //로그인
      req.login(user, { session: false }, async loginError => {
        if (loginError) {
          res.send(loginError)
          return
        }
        //토큰 생성
        const jwtToken = await jwt.sign(user)
        res.send({
          success: true,
          data: { token: jwtToken.token, user },
        })
      })
    })(req, res)
  } catch (error) {
    console.error(error)
    return
  }
})

//인증 테스트용 로그아웃 api
router.post(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      console.log(req.user.pwd, req.query.pwd)
      res.json({ success: true, msg: '성공', data: req.user })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

module.exports = router
