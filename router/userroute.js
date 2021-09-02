const express = require('express');
const path = require('path');
const router = express.Router();
const createerror = require('http-errors');
const control = require('../controller/userdata');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads')
    },
    filename : function (req,file,cb){
        cb(null,Date.now() + file.originalname)
    }
})
const upload = multer({ storage:storage });


router.get('/home',(req,res)=>{
    res.send("Route to home page");
})
// const staticpath = path.join(__dirname,'../uploads');
// console.log(staticpath);
// router.use(express.static(staticpath));


router.post("/adddetail",upload.single('Userprofile') ,async (req,res)=>{
    try{
        const profilepic = req.file.filename;
        const data = await control.adduser(req,res,profilepic);
        res.send(data);
    }
    catch(error){
        next(createerror(401,"Data not inserted in Database"));
    }
})

module.exports = router;