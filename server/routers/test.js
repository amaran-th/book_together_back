var express = require('express')
var router = express.Router()
const db = require('../module/database')()

router.get('/', (req, res) => {
  res.send({ message: 'Hello React x Node.js' })
})

module.exports = router
