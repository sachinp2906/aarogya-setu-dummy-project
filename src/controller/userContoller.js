const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createUser = async function(req ,res) {
    try{
    const data = req.body
    let {Name , PhoneNumber ,Password , Age , Pincode , AadharNo } = data
    if(!Name) return res.status(400).send({status : false, message : 'name is required'})
    if(!PhoneNumber) return res.status(400).send({status : false , message : "phone number is required"})
    if(!Password) return res.status(400).send({status : false , message : "password is required"})
    if(!Age) return res.status(400).send({status : false , message : "age is required"})
    if(!Pincode) return res.status(400).send({status : false ,  message : 'pincode is required'})
    if(!AadharNo) return res.status(400).send({status : false , message : "aadhar no is required"})

    const hashedPassword = bcrypt.hashSync(Password , 10)
    data.Password = hashedPassword

    const createData = await userModel.create(data)
    return res.status(201).send({status : true , data : createData})
    }
    catch(err) {
        return res.status(500).send({status : false , message : err.message})
    }
}

const loginUser = async function(req ,res) {
    try {
        const {PhoneNumber , Password} = req.body
        if(!PhoneNumber) return res.status(400).send({status : false , message : "phone number is required"})
        if(!Password) return res.status(400).send({status : false , message : "password is required"})
        const data = await userModel.findOne({PhoneNumber : PhoneNumber})
        if(!data) return res.status(404).send({status : false , message : "no user with this phone number"})
        const pwdCheck = await bcrypt.compare(Password , data.Password)
        if(!pwdCheck) return res.status(400).send({status : false , message : "please enter valid pwd"})

        const token = jwt.sign({userId : data._id} , 'secretkey2d' , {expiresIn : '24h'})
        return res.status(200).send({status : true , message : "user login succesfull" , data : token})
    }
    catch(err) {
        return res.status(500).send({status : false, message : err.message})
    }
}

const takeVaccineDose = async function(req ,res) {
    try{
        const userId = req.params.userId
        if(!userId) return res.status(400).send({status : false, message : 'please provide userId in path param'})
        const findUser = await userModel.findOne({_id : userId})
        if(!findUser) return res.status(404).send({status : false , message : "no such user found"})
        if(findUser.firstDose == "No") {
        const updateFirstDose = await userModel.findByIdAndUpdate({_id : userId} , {$set :{ firstDose : "Yes" , firstDoseTime : new Date()}} , {new : true , upsert : true})
        return res.status(200).send({status : true , data : updateFirstDose})
        }
        if(findUser.secondDose == "No") {
            const updateSecondDose = await userModel.findByIdAndUpdate({_id : userId} , {$set: {secondDose : "Yes" , secondDoseTime : new Data()}} , {new : true , upsert : true})
            return res.status(200).send({status : true , data : updateSecondDose})
        }
        if(findUser.boosterDose == "No") {
            const updateBoosterDose = await userModel.findByIdAndUpdate({_id : userId} , {$set : {boosterDose : "Yes" , boosterDoseTime : new Date()}} , {new : true , upsert : true})
            return res.status(200).send({status : true , data : updateBoosterDose})
        }
        return res.status(400).send({status : false, message : "you are fully vaccinated"})
    }
    catch(err) {
        return res.status(500).send({status : false, message : err.message})
    }
}

