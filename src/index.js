import mongoose, { connect } from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";


dotenv.config({
    path:'./env'
})

connectDB()

.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running port :${process.env.PORT}` );
        
    })
})

.catch((err)=>{
    console.log("Mongodb  connection is failed ", err);
    
})