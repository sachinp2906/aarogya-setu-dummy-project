const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createAdmin = async function (req, res) {
    try {
        const data = req.body
        let { adminName, adminNumber, adminPassword, adminKey } = data
        if (!adminName) return res.status(400).send({ status: false, message: "admin name is required" })
        if (!adminNumber) return res.status(400).send({ status: false, message: "admin number is required" })
        if (!adminPassword) return res.status(400).send({ status: false, message: "admin Password is required" })
        if (!adminKey || adminKey != "2dskmn") return res.status(400).send({ status: false, message: "admin key is required or provide correct admin key" })
        const hashPassword = bcrypt.hashSync(adminPassword, 10)
        data.adminPassword = hashPassword
        const createData = await adminModel.create(data)
        return res.status(201).send({ status: true, data: createData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const loginAdmin = async function (req, res) {
    try {
        const { adminNumber, adminPassword } = req.body
        if (!adminNumber) return res.status(400).send({ status: false, message: "admin number is required" })
        if (!adminPassword) return res.status(400).send({ status: false, message: "admin password is required" })
        const findAdmin = await adminModel.findOne({ adminNumber: adminNumber })
        if (!findAdmin) return res.status(404).send({ status: false, message: "no admin with this number" })
        const decodePwd = await bcrypt.compare(adminPassword, findAdmin.adminPassword)
        if (!decodePwd) return res.status(400).send({ status: false, message: "password is not valid" })

        const token = jwt.sign({ adminId: findAdmin._id }, 'adminsecretkey', { expiresIn: '24h' })
        return res.status(200).send({ status: true, message: "admin login succesfull", data: token })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getUserDetail = async function (req, res) {
    try {
        const token = req.headers['x-admin-key']
        const adminId = req.params.adminId
        const tokenVerify = jwt.verify(token, 'adminsecretkey', function (err, decode) {
            if (err) {
                return res.status(400).send({ status: false, message: "unable to decode token" })
            }
            if (decode) {
                req.body.adminId = decode
            }
        })
        if (req.body.adminId != adminId) {
            return res.status(403).send({ status: false, message: "not valid admin" })
        }
        if(Object.keys(req.query).length == 0) {
        const getUserDetails = await userModel.find().sort({Age:1})
        if(getUserDetails.length == 0) return res.status(404).send({status : false, message : "no data found"})
        return res.status(200).send({status : true , message : "data fetched succesfully" , data : getUserDetails})
        }
        let {firstDose , secondDose , boosterDose} = req.query
        let obj = {}
        if(firstDose) obj.firstDose = firstDose
        if(secondDose) obj.secondDose = secondDose
        if(boosterDose) obj.boosterDose = boosterDose

        const getUserByQuery = await userModel.find(obj).sort({Age : 1})
        if(getUserByQuery.length == 0) return res.status(404).send({status : false , message : "no data found using query"})
        return res.status(200).send({status : true , message : "data fetched succesfully using query" , data : getUserByQuery})
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

