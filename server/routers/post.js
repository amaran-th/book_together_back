var express = require('express')
var router = express.Router()
//local
var db = require('../module/database')()

//포스팅 추가
router.post('/create', (req, res) => {})

module.exports = router
