import mongoose from "mongoose"
import { DB_NAME }  from '../constants.js'


const connectDB= async()=>{
    try {
       const ConectionInstence = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log(`/n MongoDB connected !! DB host: ${ConectionInstence.connection.host}`);
       

        
    } catch (error) {
        console.log("Mongo db not connect ", error);
        process.exit(1);
        
        
    }
}

export default connectDB