require('dotenv').config()

const mysql = require('mysql')
const password = process.env.DATABASE_ROOT_PASSWORD
module.exports = () => {
  return {
    init: () => {
      console.log('init')
      return mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: password,
        database: 'TEST_DB',
      })
    },
    db_open: con => {
      console.log('connect')
      con.connect(err => {
        if (err) {
          console.error('mysql connection error :' + err)
        } else {
          console.info('mysql is connected successfully.')
        }
      })
    },
  }
}
