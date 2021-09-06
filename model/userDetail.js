const mongoose = require('mongoose');

const registerschema = new mongoose.Schema({
    devId:{
        type:Number,
        required:true
    },
    FullName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:false
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

const Register = new mongoose.model("Register",registerschema)

module.exports = Register;