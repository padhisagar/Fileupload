require('dotenv').config();
const express = require('express');
const createerror = require('http-errors');
const app = express();
const port = process.env.PORT | 8000;
require('./Database/monConn');
require('./controller/userdata');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/',require('./router/userroute'));
app.get('/',(req,res,next) => {
    res.send("Hello world");
})

app.use((req,res,next)=>{
    next(createerror(401,"Page Not found"));
})



app.use((err,req,res,next) => {
    res.status(500 || err.status)
    res.send({
        error:{
            status:err.status || 401,
            message:err.message
        }
    })
})

app.listen(port , () => {
    try {
        console.log("Connected to server ");
    } catch (error) {
        console.log(`${error}`)
    }
})