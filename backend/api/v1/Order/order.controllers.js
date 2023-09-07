import createHttpError from "http-errors"
import moment from "moment-timezone"
import Cart from "../Cart/cart.models.js"
import User from "../Users/users.models.js"
import Book from "../Books/books.models.js"
import Order from "./order.models.js"

const convertToTimezone = (i) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const m = moment(i).tz(timezone).format("YYYY-MM-DDTHH:mm:ss[Z]");
    return moment(m).utc(false);
};

const getOrderHistory = async (req, res, next) => {
    try {
        let { user_id } = req.params
        let { book_id, s_count, e_count, s_price, e_price, sort_field, sort_type, limit, offset } = req.query

        user_id = parseInt(user_id)
        limit = parseInt(limit)
        offset = parseInt(offset)
        book_id = parseInt(book_id)

        console.log(user_id, book_id, limit, offset)

        if (isNaN(user_id) || isNaN(limit) || isNaN(offset)) throw createHttpError.BadRequest("Invalid data")

        let user = await User.findOne({ user_id })
        if (!user) throw createHttpError.NotFound("User not found")

        let query = {}
        let sort = 1

        query.user_id = user_id

        if (!isNaN(book_id)) query.book_ids = {
            $in: [book_id]
        }

        s_price = parseInt(s_price)
        e_price = parseInt(e_price)
        if (!isNaN(s_price) && !isNaN(e_price)) {
            query.total_price = {
                $gte: s_price,
                $lte: e_price
            }
        } else if (!isNaN(s_price)) {
            query.total_price = {
                $gte: s_price
            }
        } else if (!isNaN(e_price)) {
            query.total_price = {
                $lte: e_price
            }
        }

        s_count = parseInt(s_count)
        e_count = parseInt(e_count)
        if (!isNaN(s_count) && !isNaN(e_count)) {
            query.total_book = {
                $gte: s_count,
                $lte: e_count
            }
        } else if (!isNaN(s_count)) {
            query.total_book = {
                $gte: s_count
            }
        } else if (!isNaN(e_price)) {
            query.total_book = {
                $lte: e_count
            }
        }

        sort_field = ["total_book", "total_price"].includes(sort_field) ? sort_field : "_id";

        if (sort_type === "desc") sort = -1
        else sort = 1

        console.log(query, sort_field, sort, limit, offset)

        let orders = await Order.find(query, "-_id -__v -updatedAt").skip(offset).limit(limit).sort({ [sort_field]: sort })

        let bookIdsMap = {}
        orders.forEach(order => {
            order.book_ids.forEach(id => (bookIdsMap[id] = {}))
        })

        let bookIdsArr = [...new Set(Object.keys(bookIdsMap).map(Number)).keys()]

        let books = await Book.find({ book_id: { $in: bookIdsArr } }, "-_id -__v -availability")

        bookIdsMap = {}
        books.forEach(book => (bookIdsMap[book.book_id] = book))

        orders.forEach(order => {
            let books = []
            order.book_ids.forEach(id => {
                let obj = bookIdsMap[String(id)]
                books.push(obj)
            })

            order._doc.book_ids = books
            order._doc.createdAt = convertToTimezone(order.createdAt).format("LLL")
        })

        console.log(orders)

        res.status(200).json({
            status: true,
            message: "Fetched cart items",
            data: orders
        })
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).json({
            status: false,
            message: err.message || "Something broke. Try again later."
        })
    }
}

const createOrder = async (req, res, next) => {
    try {
        let { user_id } = req.params

        user_id = parseInt(user_id)

        if (isNaN(user_id)) throw createHttpError.BadRequest("Invalid data found")

        let user = await User.findOne({ user_id })
        if (!user) throw createHttpError.NotFound("User not found")

        let items = await Cart.find({ user_id })

        let book_ids = []
        let total_price = 0
        let total_book = 0
        items.forEach(item => {
            book_ids.push(item.book_id)
            total_price += item.cart_price
            total_book += item.count
        })

        console.log(book_ids, total_book, total_price)

        let order = new Order({ user_id, book_ids, total_price, total_book })
        let doc = await order.save()

        console.log(doc)

        let deletedDoc = await Cart.deleteMany({ user_id })
        console.log(deletedDoc)

        res.status(200).json({
            status: true,
            message: "Order created successfully",
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
    getOrderHistory,
    createOrder
}