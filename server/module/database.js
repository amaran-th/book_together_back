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
    getAllUser: (req, res) => {
      const sql = `SELECT * FROM USERS;`
      const connection = init()
      db_open(connection)
      connection.query(sql, (error, result, fields) => {
        res.send({ data: result })
      })
    },
    getUserById: (req, res = null, callback = null) => {
      const { userId } = req
      const sql = `SELECT * FROM USERS WHERE userId=${mysql.escape(userId)};`
      console.log(sql)
      const connection = init()
      db_open(connection)
      connection.query(sql, (error, result, fields) => {
        try {
          callback(error, result[0]) //콜백함수가 있을 경우 콜백함수에 result를 넣어 실행
        } catch (error) {
          console.log(error)
          return
        }
      })
    },
    getUserByIdNProvider: (req, res = null, callback = null) => {
      const { userId, provider } = req
      const sql = `SELECT * FROM USERS WHERE userId=${mysql.escape(
        userId
      )} AND provider=${mysql.escape(provider)};`
      console.log(sql)
      const connection = init()
      db_open(connection)
      connection.query(sql, (error, result, fields) => {
        try {
          callback(error, result[0]) //콜백함수가 있을 경우 콜백함수에 result를 넣어 실행
        } catch (error) {
          console.log(error)
          return
        }
      })
    },
    getUserBySnsId: (req, res = null, callback = null) => {
      const { snsId, provider } = req
      const sql = `SELECT * FROM USERS WHERE snsId=${mysql.escape(
        snsId
      )} AND provider=${mysql.escape(provider)};`
      console.log(sql)
      const connection = init()
      db_open(connection)
      connection.query(sql, (error, result, fields) => {
        try {
          callback(error, result[0]) //콜백함수가 있을 경우 콜백함수에 result를 넣어 실행
        } catch (error) {
          console.log(error)
          return
        }
      })
    },
    addUser: (req, res = null, callback = null) => {
      const { nickName, userId, email, pwd, snsId, provider } = req
      const sql = `INSERT INTO USERS (nickName,userId,email,pwd,snsId,provider) VALUES(${mysql.escape(
        nickName
      )},${mysql.escape(userId)},${mysql.escape(email)},${mysql.escape(
        pwd
      )},${mysql.escape(snsId)},${mysql.escape(provider)});`
      console.log(sql)
      const connection = init()
      db_open(connection)
      connection.query(sql, (error, result, fields) => {
        callback(error, result) //콜백함수가 있을 경우 콜백함수에 result를 넣어 실행
      })
    },
    addSnsUser: (req, res = null, callback = null) => {
      const { nickName, userId, email, pwd, snsId, provider } = req
      const sql = `INSERT INTO USERS (nickName,userId,email,pwd,snsId,provider) VALUES(${mysql.escape(
        nickName
      )},${mysql.escape(userId)},${mysql.escape(email)},${mysql.escape(
        pwd
      )},${mysql.escape(snsId)},${mysql.escape(provider)});`
      console.log(sql)
      const connection = init()
      db_open(connection)
      connection.query(sql, (error, result, fields) => {
        callback(error, { nickName, userId, email, pwd, snsId, provider }) //콜백함수가 있을 경우 콜백함수에 result를 넣어 실행
      })
    },
    removeUser: (req, res = null, callback = null) => {
      const { userId } = req
      const sql = `DELETE FROM USERS WHERE userId=${mysql.escape(userId)};`
      //console.log(sql)
      const connection = init()
      db_open(connection)
      connection.query(sql, (error, result, fields) => {
        callback(error, result) //콜백함수가 있을 경우 콜백함수에 result를 넣어 실행
      })
    },
  }
}
