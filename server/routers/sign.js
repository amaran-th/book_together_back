var express = require('express')
var router = express.Router()
var db = require('../module/database')()
const jwt = require('../module/jwt')

const check = user => {
  //TODO user 정보가 양식에 맞는지 확인하는 함수
  return true
}

//회원가입
router.post('/signup', (req, res) => {
  if (check(req.query)) {
    db.getUserById(req.query, res, async (error, result) => {
      if (!result || result?.length === 0) {
        db.addUser(req.query, res, async (error, result) => {
          res.send({ success: true, message: '유저 추가 완료' })
        })
      } else {
        res.send({ success: false, message: '이미 존재하는 유저입니다.' })
      }
    })
  } else {
    res.send({ success: false, message: '양식을 다시 확인해주십시오.' })
  }
})

//로그인
router.post('/signin', (req, res) => {
  db.getUserById(req.query, res, async (error, result) => {
    //console.log(req.query.pwd, result?.pwd)
    if (result) {
      if (result?.pwd == req.query.pwd) {
        const jwtToken = await jwt.sign(result)
        res.send({
          success: true,
          data: { token: jwtToken.token, user: result },
        })
      } else {
        res.send({ success: false, message: '비밀번호가 틀립니다.' })
      }
    } else {
      res.send({ success: false, message: '로그인에 실패하였습니다.' })
    }
  })
})

module.exports = router
