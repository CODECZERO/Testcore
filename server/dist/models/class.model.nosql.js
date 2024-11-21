import mongoose from "mongoose";
const ClassSchema = new mongoose.Schema({
    //timetable model or time table finding
    name: {
        type: String,
        index: true,
        unique: true,
        require: true,
    },
}, { timestamps: true });
ClassSchema.pre('save', function (next) {
    //and removes special characters from string 
    //save it in lower case string 
    //you can also enable special characters but it will create different string , which are same in a sense 
    //becasue of that i won't recommed that 
    if (this.name) {
        this.name = this.name.toLowerCase().replace(/[^a-z0-9\s]/gi, '');
    }
    next();
});
export const ClassModel = mongoose.model("classmodel", ClassSchema);
