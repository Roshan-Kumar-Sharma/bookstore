import createHttpError from "http-errors"
import moment from "moment-timezone"
import Cart from "./cart.models.js"
import User from "../Users/users.models.js"
import Book from "../Books/books.models.js"

const convertToTimezone = (i) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const m = moment(i).tz(timezone).format("YYYY-MM-DDThh:mm:ss[Z]");
    return moment(m).utc(false);
};

const getCartItems = async (req, res, next) => {
    try {
        let { user_id } = req.params

        user_id = parseInt(user_id)

        if (isNaN(user_id)) throw createHttpError.BadRequest("Invalid user id")

        // console.log(user_id)

        let cartItems = await Cart.find({ user_id }, "-_id -__v -createdAt")

        if (!cartItems.length) throw createHttpError.NotFound("No items found in cart for user")

        let bookIdsMap = {}
        cartItems.forEach(item => (bookIdsMap[item.book_id] = item))

        let books = await Book.find({ book_id: { $in: Object.keys(bookIdsMap) } }, "-_id -__v -availability")

        let ApiResponse = []
        books.forEach(book => {
            let obj = { ...book._doc }

            obj.lastAdded = convertToTimezone(bookIdsMap[String(book.book_id)].updatedAt).format("YYYY-MM-DDTHH:mm:ss[Z]")
            obj.orderCount = bookIdsMap[String(book.book_id)].count
            obj.totalPrice = bookIdsMap[String(book.book_id)].cart_price

            delete obj.price

            ApiResponse.push(obj)

        })

        // console.log(ApiResponse)

        res.status(200).json({
            status: true,
            message: "Fetched cart items",
            data: ApiResponse
        })
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).json({
            status: false,
            message: err.message || "Something broke. Try again later."
        })
    }
}

const deleteItemInCart = async (req, res, next) => {
    try {
        let { user_id, book_id } = req.params

        user_id = parseInt(user_id)
        book_id = parseInt(book_id)

        if (isNaN(user_id) || isNaN(book_id)) throw createHttpError.BadRequest("Invalid data found")

        let deletedItem = await Cart.findOneAndDelete({ user_id, book_id })

        if (!deletedItem) throw createHttpError.NotFound("No item found to delete")

        console.log(deletedItem)

        res.status(200).json({
            status: true,
            message: "Removed item from cart",
        })
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).json({
            status: false,
            message: err.message || "Something broke. Try again later."
        })
    }
}

const addItemInCart = async (req, res, next) => {
    try {
        let { user_id } = req.params
        let { book_id, count } = req.body

        user_id = parseInt(user_id)
        book_id = parseInt(book_id)
        count = parseInt(count)

        if (isNaN(user_id) || isNaN(book_id) || isNaN(count)) throw createHttpError.BadRequest("Invalid data found")

        let user = await User.findOne({ user_id })
        if (!user) throw createHttpError.NotFound("User not found")

        let book = await Book.findOne({ book_id })
        if (!book) throw createHttpError.NotFound("Book not found")

        if (book.availability) throw createHttpError.BadRequest("Book is currently not available")

        let item = await Cart.findOne({ user_id, book_id })
        if (item) {
            let count = item.count + count
            let cart_price = item.cart_price + (count * book.price)
            let doc = await Cart.updateOne({ user_id, book_id }, { count, cart_price })
            console.log(doc)
        } else {
            let doc = new Cart({ book_id, user_id, count, cart_price: count * book.price })
            await doc.save()
        }

        res.status(200).json({
            status: true,
            message: "Item added in the cart",
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
    getCartItems,
    deleteItemInCart,
    addItemInCart
}
