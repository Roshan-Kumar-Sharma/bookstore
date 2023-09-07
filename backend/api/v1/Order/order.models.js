import { DB_CONNECTION } from "../../../configs/db.configs.js";
import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema({
    user_id: {
        type: Number,
        required: [true, "user id is required"]
    },
    book_ids: {
        type: [Number],
        required: [true, "book ids are required"]
    },
    total_book: {
        type: Number,
        required: [true, "total book is required"],
        validate: {
            validator: (value) => value > 0,
            message: "count must be atleast 1"
        }
    },
    total_price: {
        type: Number,
        required: [true, "total price is required"]
    }
}, { timestamps: true });

const Order = DB_CONNECTION.model("Order", OrderSchema);

export default Order
