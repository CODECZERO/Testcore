import mongoose from "mongoose";
const examDataStoreSchema = new mongoose.Schema({
    tokenID: {
        type: String,
        require: true,
        unique: true,
        index: true
    },
    examID: {
        type: String,
        require: true,
        unique: true
    }
}, { timestamps: true });
export const examDataStore = mongoose.model("examDataStore", examDataStoreSchema);
