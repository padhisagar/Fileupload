const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_Db,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true,
    // useFindAndModify:true
}).then(()=>{
    console.log("Database Connection Sucessfully");
}).catch(()=>{
    console.log("Not connected To database");
});