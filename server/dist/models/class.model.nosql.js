import mongoose from "mongoose";
const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true,
        require: true,
    },
}, { timestamps: true });
ClassSchema.pre('save', function (next) {
    if (this.name) {
        this.name = this.name.toLowerCase().replace(/[^a-z0-9\s]/gi, '');
    }
    next();
});
export const ClassModel = mongoose.model("classmodel", ClassSchema);
