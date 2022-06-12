const express = require('express')
const app = express()
const testRouter = require('./routers/test')
const signRouter = require('./routers/sign')
const cors = require('cors')

app.use(cors())

app.use('/test', testRouter)
app.use('/sign', signRouter)

const port = 3002

app.listen(port, () => {
  console.log(`express is running on ${port}`)
})
