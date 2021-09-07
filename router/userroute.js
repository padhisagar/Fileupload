const express = require('express');
const path = require('path');
const router = express.Router();
const createerror = require('http-errors');
const control = require('../controller/userdata');
const generatepassword = require('password-generator');
const multer = require('multer');
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const verifyu = require('../middleware/authandauth');
router.use(cookieparser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const upload = multer({ storage: storage });


router.get('/home', (req, res) => {
    res.send("Route to home page");
})
// const staticpath = path.join(__dirname,'../uploads');
// console.log(staticpath);
// router.use(express.static(staticpath));


router.post("/adddetail", upload.single('Userprofile'), async (req, res, next) => {
    try {
        const profilepic = req.file.filename;
        const vali = path.extname(profilepic);
        if (vali == ".png" || vali == ".jpg" || vali == ".jpeg") {
            const password = generatepassword();
            console.log(password);
            const data = await control.adduser(req, res, next, profilepic, password);
            if (data) {
                res.send({
                    message: `${data.FullName} register with our database . Login Credintal has been send to your mail`
                });
            }
        }
        else {
            next(createerror(401, "Upload .png , .jpg , .jpeg"));
        }
    }
    catch (error) {
        next(createerror(401, "Data not inserted in Database"));
    }
})

router.post('/loginuser', async (req, res, next) => {
    try {
        const result = await control.loginuser(req, res);
        const len = result.length;
        res.send(result);
    } catch (error) {
        res.status(401).send({ msg: `${error}` })
    }
})

router.get('/getadd', verifyu.auth, async (req, res) => {
    try {
        // console.log(req.cookies.jwt);
        // console.log(req.user);
        const result = await control.getalldetail(req, res);
        res.send(result);
    } catch (error) {
        res.status(401).send({
            msg: "No data retrieve"
        })
    }
})

router.post('/addfeedback/:id', verifyu.auth, async (req, res) => {
    try {
        const rid = req.params.id;
        // const verify = jwt.verify(token,process.env.TOKEN);
        const data = req.user;
        const result = await control.insertfeedback(req, res,data._id,rid);
        res.send(result);
    } catch (error) {
        res.status(401).send({
            msg: "FeedBack is Not updated"
        })
    }
})

router.get('/feedback', verifyu.auth, async (req, res) => {
    try {
        // const rid = req.params.id;
        // const token = req.cookies.jwt;
        // const verify = jwt.verify(token,process.env.TOKEN);
        // console.log(verify._id);
        const data = await control.getuserfeedback(req, res, req.user._id);
        res.send(data);
    } catch (error) {
        res.status(401).send({
            msg: "Error occurred"
        })
    }
})

router.get('/logout', verifyu.auth , async (req,res)=>{
    try {
        res.clearCookie("jwt");
        res.send({
            msg:'Successfully logout'
        })
    } catch (error) {
        res.status(401).send({
            error:{
                msg:"Error has occurred"
            }
        })
    }
})


module.exports = router;