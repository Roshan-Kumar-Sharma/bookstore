import express from "express"

const Router = express.Router()

import UserRoutes from "./Users/users.routes.js"
import BookRoutes from "./Books/books.routes.js"

Router.use("/users", UserRoutes)
Router.use("/books", BookRoutes)

export default Router