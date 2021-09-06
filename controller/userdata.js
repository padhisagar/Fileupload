const express = require('express');
const bcrypt = require('bcryptjs');
const Register = require('../model/userDetail');
const FeedBack = require('../model/feedback');
const dv = require('../validate/verifydata')
const createerror = require('http-errors');
const tok = require('../middleware/authandauth');
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

const getalldetail = async (req,res) =>{
    try {
        const record = await Register.find({});
        return record
    } catch (error) {
        return error;
    }
}

const insertfeedback = async (req,res) => {
    try {
        const feed = new FeedBack({
            sender_id:req.body.sid,
            receiver_id:req.body.rid,
            Feedback_data:req.body.feeddata
        })
        const data = await feed.save();
        return data;
    } catch (error) {
        return error;
    }
}

const getuserfeedback = async (req,res,rid) =>{
    try {
        const result = await FeedBack.find({receiver_id:rid},{_id:0,sender_id:0});
        return result;
    } catch (error) {
        return error;
    }
}

module.exports.adduser = adduser;
module.exports.loginuser = loginuser;
module.exports.getalldetail = getalldetail;
module.exports.insertfeedback = insertfeedback;
module.exports.getuserfeedback = getuserfeedback;