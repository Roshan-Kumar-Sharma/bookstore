import createHttpError from "http-errors"
import Book from "./books.models.js"

const getBook = async (req, res, next) => {
    try {
        let { book_id } = req.params

        book_id = parseInt(book_id)

        if (isNaN(book_id)) throw createHttpError.BadRequest("Invalid book id")

        let book = await Book.findOne({ book_id }, "-_id -__v")

        if (!book) throw createHttpError.NotFound("No such book found")

        res.status(200).json({
            status: true,
            message: "Fetched book",
            data: book
        })
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).json({
            status: false,
            message: err.message || "Something broke. Try again later."
        })
    }
}

const getAllBooks = async (req, res, next) => {
    try {
        let { title, author, genre, publisher, s_price, e_price, sort_field, sort_type, limit, offset } = req.query

        limit = parseInt(limit)
        offset = parseInt(offset)

        if (isNaN(limit) || isNaN(offset)) throw createHttpError.BadRequest("Invalid payload")

        let query = {}
        let sort = 1

        let payload = Object.assign({}, { title, author, genre, publisher })

        Object.entries(payload).forEach(([key, value]) => {
            if (value) query[key] = {
                $regex: value,
                $options: "i"
            }
        })

        s_price = parseInt(s_price)
        e_price = parseInt(e_price)
        if (!isNaN(s_price) && !isNaN(e_price)) {
            query.price = {
                $gte: s_price,
                $lte: e_price
            }
        } else if (!isNaN(s_price)) {
            query.price = {
                $gte: s_price
            }
        } else if (!isNaN(e_price)) {
            query.price = {
                $lte: e_price
            }
        }

        console.log(query)

        sort_field = ["title", "author", "publisher", "genre", "price"].includes(sort_field) ? sort_field : "_id";

        if (sort_type === "desc") sort = -1
        else sort = 1

        let books = await Book.find(query, "-_id -__v").skip(offset).limit(limit).sort({ [sort_field]: sort })

        res.status(200).json({
            status: true,
            message: "Fetched all users",
            data: books
        })
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).json({
            status: false,
            message: err.message || "Something broke. Try again later."
        })
    }
}

const createBook = async (req, res, next) => {
    try {
        let book_id = undefined
        let data = { ...req.validation }

        let book = await Book.findOne({}).sort({ book_id: -1 })
        if (!book) book_id = 1
        else book_id = book.book_id + 1;

        ["title", "author", "publisher", "genre"].forEach(field => {
            data[field] = data[field].charAt(0).toUpperCase() + data[field].slice(1)
        })

        book = new Book({ ...data, book_id })

        const doc = await book.save()

        console.log(doc)

        res.status(200).json({
            status: true,
            message: "Book created successfully",
        })
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).json({
            status: false,
            message: err.message || "Something broke. Try again later."
        })
    }
}


export {
    getBook,
    getAllBooks,
    createBook
}