const express = require('express');
const bcrypt = require('bcryptjs');
const Register = require('../model/userDetail');


const adduser = async (req, res,prof) => {
    try {
        const user = new Register({
            FullName: req.body.fullname,
            Email: req.body.email,
            Password: bcrypt.hashSync(req.body.password, 10),
            photo: prof,
            active: req.body.active,
            Gender: req.body.gender,
            Phone: req.body.phone,
            age: req.body.age
        })
        const adddet = await user.save();
        return adddet;
    } catch (error) {
        return error;
    }
}

module.exports.adduser = adduser;