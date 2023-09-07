import express from "express"

const Router = express.Router()

import UserRoutes from "./Users/users.routes.js"
import BookRoutes from "./Books/books.routes.js"
import CartRoutes from "./Cart/cart.routes.js"
import OrderRoutes from "./Order/order.routes.js"

Router.use("/users", UserRoutes)
Router.use("/books", BookRoutes)
Router.use("/cart", CartRoutes)
Router.use("/order", OrderRoutes)

export default Router