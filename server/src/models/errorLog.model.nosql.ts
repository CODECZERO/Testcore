import mongoose from "mongoose";

const errorSchema=new mongoose.Schema({
    error:{
        type:String,
        require:true,
    }
},{timestamps:true})

export const errorLoger=mongoose.model("error",errorSchema);