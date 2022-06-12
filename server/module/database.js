require('dotenv').config()

const mysql = require('mysql')
const password = process.env.DATABASE_ROOT_PASSWORD

const init = () => {
  console.log('init')
  return mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: password,
    database: 'BOOK_TOGETHER',
  })
}
const db_open = con => {
  console.log('connect')
  con.connect(err => {
    if (err) {
      console.error('mysql connection error :' + err)
    } else {
      console.info('mysql is connected successfully.')
    }
  })
}
module.exports = () => {
  return {
    getAllUser: (res, req) => {
      const sql = `SELECT * FROM USERS`
      const connection = init()
      db_open(connection)
      connection.query(sql, (error, result, fields) => {
        res.send({ data: result })
      })
    },
    getUserById: (req, res, callback = null) => {
      const sql = `SELECT * FROM USERS WHERE userId='${req.userId}'`
      const connection = init()
      db_open(connection)
      connection.query(sql, (error, result, fields) => {
        if (callback) callback(error, result)
        else {
          if (error) {
            console.log(error)
          } else if (result.length == 0) {
            res.send({ data: '유저가 없음' })
          } else res.send({ data: result[0] })
        }
      })
    },
  }
}
