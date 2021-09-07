const Register = require('../model/userDetail');
const jwt = require('jsonwebtoken');

const createtoken = async (user) =>{
    const tokens = jwt.sign({
        _id:user._id,
        devid:user.devId
    },process.env.TOKEN);
    return tokens;
}

const auth = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        const verified = jwt.verify(token,process.env.TOKEN);
        const user = await Register.findOne({_id:verified._id});
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({
            error:{
                msg:"Imvalid Token or login please"
            }
        })
    }
}



module.exports.createtoken =createtoken;
module.exports.auth = auth;
