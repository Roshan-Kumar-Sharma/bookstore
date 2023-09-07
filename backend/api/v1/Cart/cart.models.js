import { DB_CONNECTION } from "../../../configs/db.configs.js";
import mongoose from "mongoose";

const { Schema } = mongoose;

const CartSchema = new Schema({
    user_id: {
        type: Number,
        required: [true, "user id is required"]
    },
    book_id: {
        type: Number,
        required: [true, "book id is required"]
    },
    count: {
        type: Number,
        required: [true, "count is required"],
        validate: {
            validator: (value) => value !== 0,
            message: "count must be atleast 1"
        }
    },
    cart_price: {
        type: Number,
        required: [true, "cart price is required"]
    }
}, { timestamps: true });

const Cart = DB_CONNECTION.model("Cart", CartSchema);

export default Cart
