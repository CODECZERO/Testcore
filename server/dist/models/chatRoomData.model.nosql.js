import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    roomName: {
        type: String,
        require: true,
        unique: true,
        index: true
    },
    AdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });
export const chatModel = mongoose.model("Chatmodel", chatSchema);
