const { boolean } = require('joi');
const mongoose = require('mongoose');

const feedschema = new mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register',
        required:true
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register',
        required:true
    },
    receiver_name:{
        type:String,
        required:true
    },
    Profile:{
        type:String,
        required:true
    },
    flag:{
        type:Boolean,
        default:false
    },
    date:{
          type:Date,
          default:Date.now()    
    }    
})

const FeedBackMain = new mongoose.model("FeedBackMain",feedschema);

module.exports = FeedBackMain;