var express = require('express')
var router = express.Router()
const db = require('../module/database')()
const verifyToken = require('../module/jwt').verify

router.get('/', (req, res) => {
  res.send({ message: 'Hello React x Node.js' })
})

router.get('/verify', verifyToken, (req, res) => {
  //const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTUwODE3MzB9.Pzwwe7-TAziI9inYHGtduOu5uJaxJQq-VL0oUiOCn5I"
  res.json(req.decoded)
})

router.get('/test', (req, res) => {
  db.getUserById({ userId: 'testIdㅇ2' }, res, (error, result) => {
    if (error) {
      console.log(error)
    } else if (result.length == 0) {
      res.send({ data: '유저가 없음' })
    } else res.send({ data: result[0] })
  })
})
module.exports = router
