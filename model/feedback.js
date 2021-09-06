const mongoose = require('mongoose');

const feedbackschema = new mongoose.Schema({
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
    Feedback_data:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

const FeedBack = new mongoose.model("FeedBack",feedbackschema);

module.exports = FeedBack;