var express = require('express')
var router = express.Router()
const db = require('../module/database')()

router.get('/', (req, res) => {
  res.send({ message: 'Hello React x Node.js' })
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
