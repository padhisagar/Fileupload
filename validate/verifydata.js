const Joi = require('joi');

const userschema = Joi.object({
    fullname:Joi.string().alphanum().required(),
    email:Joi.string().email().required(),
    Userprofile:Joi.string()
})

module.exports.userschema = userschema;