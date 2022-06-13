var express = require('express')
var router = express.Router()
var db = require('../module/database')()
const jwt = require('../module/jwt')

router.post('/signin', (req, res) => {
  const { userId, pwd } = req
  db.getUserById({ userId: userId }, res, async (error, result) => {
    const jwtToken = await jwt.sign(result)
    res.send({ token: jwtToken.token })
  })
})

module.exports = router
