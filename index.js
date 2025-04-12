require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose')
const {MONGO_URL} = require('./config')

const {userRouter} = require('./routes/users')
const {adminRouter} = require('./routes/admin')
const {courseRouter} = require('./routes/courses')


const app = express();

app.use(express.json());

app.use("/users",userRouter);
app.use("/course",courseRouter);
app.use("/admin",adminRouter);

async function main(){
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Connected to the database");
        app.listen(3000,()=>{
            console.log("Port is listening on 3000");
        })
    }
    catch(e){
        console.log("Failed to connect to the database",e)
    }
}
main();
