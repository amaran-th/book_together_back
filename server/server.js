const express = require('express')
const app = express()
const testRouter = require('./routers/test')
const authRouter = require('./routers/auth')
const cors = require('cors')
const passport = require('passport')
const passportConfig = require('./module/passport')

app.use(cors())

app.use(passport.initialize())
passportConfig()
app.use('/test', testRouter)
app.use('/auth', authRouter)

const port = 3002

app.listen(port, () => {
  console.log(`express is running on ${port}`)
})
