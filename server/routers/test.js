var express = require('express')
var router = express.Router()
const db = require('../module/database')()

router.get('/', (req, res) => {
  res.send({ message: 'Hello React x Node.js' })
})
router.get('/database', (req, res) => {
  const mysql = require('../module/database')()
  const connection = mysql.init()
  mysql.db_open(connection)
  connection.query('SELECT * FROM USERS', (error, result, fields) => {
    if (error) {
      console.log(error)
    }
    res.send({ message: result })
  })
})
router.get('/test', (req, res) => {
  db.getUserById({ userId: 'testIdㅇ2' }, res)
})
module.exports = router
