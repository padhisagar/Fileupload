const express = require('express');
const bcrypt = require('bcryptjs');
const Register = require('../model/userDetail');
const FeedBack = require('../model/feedback');
const Feedbackmain = require('../model/feedmanager');
const dv = require('../validate/verifydata')
const createerror = require('http-errors');
const tok = require('../middleware/authandauth');
const nodemailer = require("nodemailer");
console.log(tok);

const adduser = async (req, res, next, prof, password) => {
    try {
        const user = new Register({
            devId: Math.floor(Math.random() * 100),
            FullName: req.body.fullname,
            Email: req.body.email,
            Password: bcrypt.hashSync(password, 10),
            photo: prof,
        })
        const result = await dv.userschema.validateAsync(req.body);
        if (result) {
            const adddet = await user.save();
            return adddet;
        }
        else {
            next(createerror(401, "Data are not validate"));
        }
    } catch (error) {
        return error;
    }
}

const sendmail = async (a, e, p) => {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
    let info = await transporter.sendMail({
        from: '"FeedbackSystem" <foo@example.com>', // sender address
        to: "sagarpadhi005@gmail.com", // list of receivers
        subject: "Login Credintal", // Subject line
        text: `hello ${a} . Thank You for register .
         Your login Crediantal detail are given below
         email id: ${e} 
        Password is ${p}`,
        html:"<a href='http://localhost:8000/api/loginuser'>Click here to login</a>",
    });
    if (info.messageId) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return true;
    }
}

const loginuser = async (req, res, next) => {
    try {
        const useremail = req.body.email;
        const data = await Register.findOne({ Email: useremail });
        const result = bcrypt.compareSync(req.body.password, data.Password);
        if (result) {
            const token = await tok.createtoken(data);
            res.cookie("jwt", token, {
                httpOnly: true
            });
            const feeddata = await FeedBack.find({ receiver_id: data._id }, { _id: 0, sender_id: 0 }).
                populate('receiver_id', 'FullName Email devId photo');
            return feeddata;
        } else {
            res.status(201).send({
                error: {
                    msg: "Email id or password not match"
                }
            })
        }
    } catch (error) {
        return error;
    }
}

const getalldetail = async (req, res) => {
    try {
        const record = await Register.find({});
        return record
    } catch (error) {
        return error;
    }
}

const insertfeedback = async (req, res, sid, rid) => {
    try {
        const feed = new FeedBack({
            sender_id: sid,
            receiver_id: rid,
            Feedback_data: req.body.feeddata
        })
        const data = await feed.save();
        if(data){
            const result = await Feedbackmain.updateOne({$and:[{sender_id:sid},{receiver_id:rid}]},{$set:{flag:true}});
        }
        return data;
    } catch (error) {
        return error;
    }
}

const getuserfeedback = async (req, res, rid) => {
    try {
        const result = await FeedBack.find({ receiver_id: rid }, { _id: 0, sender_id: 0 });
        return result;
    } catch (error) {
        return error;
    }
}

const adduserfeedback = async (req, res, sid) => {
    try {
        const record = await Register.aggregate([
            { $match: { _id: { $ne: sid } } },
            { $sample: { size: 2 } }
        ])
        const data = [];
        for (let i = 0; i < 2; i++) {
            const feed = new Feedbackmain({
                sender_id: sid,
                receiver_id: record[i]._id,
                receiver_name: record[i].FullName,
                Profile: record[i].photo
            })
            const result = await feed.save();
            data.push(result);
        }
        return data;
    } catch (error) {
        return error;
    }
}

module.exports.adduser = adduser;
module.exports.loginuser = loginuser;
module.exports.getalldetail = getalldetail;
module.exports.insertfeedback = insertfeedback;
module.exports.getuserfeedback = getuserfeedback;
module.exports.sendmail = sendmail
module.exports.adduserfeedback = adduserfeedback;