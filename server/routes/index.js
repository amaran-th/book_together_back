var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  res.send({ greeting: 'Hello React x Node.js' })
})
module.exports = router
