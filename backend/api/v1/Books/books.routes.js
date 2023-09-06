import * as BookController from "./books.controllers.js"
import { validateBookMiddleware } from "./books.middleware.js"

import express from "express"

const Router = express.Router()

Router.get("/id/:book_id", BookController.getBook)
Router.get("/list", BookController.getAllBooks)

Router.post("/create", validateBookMiddleware, BookController.createBook)


export default Router