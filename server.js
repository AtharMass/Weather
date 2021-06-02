const path = require('path')
var express = require('express')
var mongoose = require('mongoose')
const api = require('./server/routes/api')

var app = express()

mongoose.connect(process.env.MONGODB_URI||"mongodb://localhost/weather")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.use('/', api)


/*=====================================================
Start the server:
=======================================================*/
const port = 7070
app.listen(process.env.PORT || port, function() {
    console.log(`Server up and running on port ${port}`)
})
  
  
