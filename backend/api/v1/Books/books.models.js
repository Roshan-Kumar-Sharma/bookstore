import { DB_CONNECTION } from "../../../configs/db.configs.js";
import mongoose from "mongoose";

const { Schema } = mongoose;

const BookSchema = new Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },
    author: {
        type: String,
        required: [true, "author is required"]
    },
    publisher: {
        type: String,
        required: [true, "publisher is required"]
    },
    book_id: {
        type: Number,
        unique: true,
        required: [true, "book id is required"]
    },
    genre: {
        type: String,
        required: [true, "genre is required"]
    },
    price: {
        type: Number,
        required: [true, "price is required"],
    },
    availability: {
        type: Date,
    }
});

const Book = DB_CONNECTION.model("Book", BookSchema);

export default Book
