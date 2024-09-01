import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    sqlId: {
        type: String,
        require: true,
        index:true
    },
    profile: {
        type: String,
        require: true
    },
    chatRoomIDs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chatmodel"
        }
    ]
}, { timestamps: true })

const User = mongoose.model("User", UserSchema)

export { User };