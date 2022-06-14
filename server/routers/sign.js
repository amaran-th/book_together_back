var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt')

//local
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
router.delete('/user', jwt.verify, (req, res) => {
  console.log(req.decoded.pwd, req.query.pwd)
  bcrypt.compare(req.query.pwd, req.decoded?.pwd, async (err, same) => {
    if (same) {
      try {
        db.removeUser(
          { userId: req.decoded?.userId },
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
})

//로그인
router.post('/signin', (req, res) => {
  db.getUserById(req.query, res, (error, result) => {
    //console.log(req.query.pwd, result?.pwd)
    if (result) {
      bcrypt.compare(req.query.pwd, result.pwd, async (err, same) => {
        if (same) {
          const jwtToken = await jwt.sign(result)
          res.send({
            success: true,
            data: { token: jwtToken.token, user: result },
          })
        } else {
          res.send({ success: false, msg: '비밀번호가 틀립니다.' })
        }
      })
    } else {
      res.send({ success: false, msg: '로그인에 실패하였습니다.' })
    }
  })
})

module.exports = router
