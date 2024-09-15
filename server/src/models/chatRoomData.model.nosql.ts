import mongoose  from "mongoose";

const chatSchema=new mongoose.Schema({
    romeName:{
        type:String,
        require:true,
        unique:true,
        index:true
    },
    encryptCode:{
        type:String,
        require:true,
        unique:true
    },
    iv:{
        type:String,
        require:true,
        unique:true
    },
    AdminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    
},{timestamps:true});

export const chatModel=mongoose.model("Chatmodel",chatSchema);