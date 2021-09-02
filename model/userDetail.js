const mongoose = require('mongoose');

const registerschema = new mongoose.Schema({
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
    active:Boolean,
    date:{
        type:Date,
        default:Date.now()
    },
    Gender:{
        type:String,
        required:true
    },
    Phone:{
        type:Number,
        required:true,
    },
    age:{
        type:Number,
        required:true,
        min:18,
        max:60
    }
})

const Register = new mongoose.model("Register",registerschema)

module.exports = Register;