const express = require('express')
const mongoose = require('mongoose')
const app = express()
const route = require('./routes/route')

app.use(express.json())

mongoose.connect('mongodb+srv://sachinfu:2906@sachinfu.fcpe6tc.mongodb.net/aarogya-project-db' , {
    usrNewUrlParser : true
})
.then(() => console.log("mongodb is connected"))
.catch(err => console.log(err.message))

app.use('/' , route)

app.listen(3000 , function() {
    console.log("express app running on port 3000")
})