if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
//variables for npm packages
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// Routes Variables
const indexRouter = require('./routes/index')
const patientRouter = require('./routes/patients')
const ehrRouter = require('./routes/ehrs')

// Views set for page rendering
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method')) // for put/delete requests
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

// MongoDB Connection Setup
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/patients', patientRouter)
app.use('/ehrs', ehrRouter)

app.listen(process.env.PORT || 3000)