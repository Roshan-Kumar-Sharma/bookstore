import { DB_CONNECTION } from "../../../configs/db.configs.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt"

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: true
    },
    user_id: {
        type: Number,
        unique: true,
        required: [true, "user id is required"]
    },
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    } catch (err) {
        next(err)
    }
})

const User = DB_CONNECTION.model("User", UserSchema);

export default User
