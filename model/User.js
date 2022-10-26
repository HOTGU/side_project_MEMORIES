import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
    },
    emailVerify: {
        type: Boolean,
        default: false,
    },
    emailVerifyString: {
        type: String,
        default: uuidv4(),
    },
});

const User = mongoose.model("User", userSchema);

export default User;
