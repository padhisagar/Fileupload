const Register = require('../model/userDetail');
const jwt = require('jsonwebtoken');

const createtoken = async (user) =>{
    const tokens = jwt.sign({
        _id:user._id,
        devid:user.devId
    },'abcdefghijklmnopqrstuvwxyz');
    return tokens;
}



module.exports.createtoken =createtoken;
