var express = require('express')
var router = express.Router()
var db = require('../module/database')()
const jwt = require('../module/jwt')

router.get('/signin', (req, res) => {
  db.getUserById({ userId: 'testId2' }, res, async (error, result) => {
    const jwtToken = await jwt.sign(result)
    res.send({ token: jwtToken.token })
  })
})

module.exports = router
