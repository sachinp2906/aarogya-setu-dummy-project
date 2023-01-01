const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    Name : {
        type : String,
        required : true
    },
    PhoneNumber : {
        type : String,
        required : true
    },
    Password : {
        type : String,
        required : true
    },
    Age : {
        type : String,
        required : true
    },
    Pincode : {
        type : String,
        required : true
    },
    AadharNo : {
        type : Number,
        required : true
    },
    firstDose : {
        type : String,
        enum : ["Yes" , "No"],
       default : "No"
    },
    firstDoseTime : {
        type : Date,
        default : Null
    },
    secondDose : {
        type : String,
        enum : ["Yes" , "No"],
        default : "No"
    },
    secondDoseTime : {
        type : Date,
        default : Null
    },
    boosterDose : {
        type : String,
        enum : ["Yes" , "No"],
    },
    boosterDoseTime : {
        type : Date,
        default : "No"
    }
},{timestamps:true})

module.exports = mongoose.model('user' , userSchema)