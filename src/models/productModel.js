import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,

        },
        description:{
            type:String,
            required:true,
            trim:true,
        },
        price:{
            type:Number,
            required:true,
            trim:true,
            min:0
        },
        image:{
            type:Array,
            required:true,
            
        }
        ,
        category:{
            type:String,
            required:true,
        },
        subCategory:{
            type:String,
            required:true,
        }
        ,
        size:{
            type:Array,
            required:true,
        },
        bestseller:{
            type:Boolean,
        },
        date:{
            type:Number,
            required:true,
        }

    }
)



export const Product = mongoose.model("Product",productSchema)