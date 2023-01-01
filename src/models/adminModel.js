const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    adminName : {
        type : String,
        required : true
    },
    adminPassword : {
        type : String,
        requires : true
    },
    adminKey : {
        type : String,  // admin key is fix (2dskmn)
        required : true
    }
}, {timestamps : true})

module.exports = mongoose.model('admin' , adminSchema)