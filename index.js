const express = require('express')
const cors = require('cors')
require('dotenv').config() // to use .env variables
require('./db/connectDB')
const app = express()

// Import routes
const authRoutes = require('./routes/auth')

app.use(express.json())
app.use(cors())

// Middlewares
app.use('/api', authRoutes)

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server on port: ${port}`)
})
