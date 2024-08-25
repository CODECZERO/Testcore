import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    sqlId: {
        type: String,
        require: true
    },
    profile: {
        type: String,
        require: true
    }
}, { timestamps: true });
const User = mongoose.model("User", UserSchema);
export { User };
