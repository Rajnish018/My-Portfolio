import mongoose from "mongoose";



const adminAccountSchema= new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    },
    avatarPublicId:{
        type:String,
    }
},{timestamps:true})



export const AdminAccount=mongoose.model("AdminAccount",adminAccountSchema)