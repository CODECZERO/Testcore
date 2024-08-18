import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
    Class: {
        type: String,
        require: true,
        index:true

    },
    Subjects: [],
    Aprrove:{
        type:Boolean,
        require:true
    },
    CollegeName:{
        type:String,
        require:true

    }
}, { timestamps: true });

export const TimeTable = mongoose.model("Timetable", timetableSchema);