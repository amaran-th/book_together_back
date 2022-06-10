var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  res.send({ message: 'Hello React x Node.js' })
})
router.get('/database', (req, res) => {
  const mysql = require('./database')()
  const connection = mysql.init()
  mysql.db_open(connection)
  connection.query('SELECT * FROM USERS', (error, result, fields) => {
    if (error) {
      console.log(error)
    }
    res.send({ message: result })
    console.log(result)
  })
})
module.exports = router
