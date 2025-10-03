import express from "express" 
import cookieParser from "cookie-parser"
import cors from "cors"


const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


///routes

import userRoutes from "./routes/userRoutes.js"

import productRoute from "./routes/productRoute.js"

import cartRoute from "./routes/CartRoutes.js"

import orderRoute from "./routes/orderRoutes.js"

///routes decalration 

app.use("/api",userRoutes)
app.use("/api",productRoute) 
app.use("/api",cartRoute)
app.use("/api", orderRoute)

 
export {app}