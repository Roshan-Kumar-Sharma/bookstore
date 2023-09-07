import * as CartController from "./cart.controllers.js"
import { validateCartMiddleware } from "./cart.middleware.js"
import { verifyAccessToken } from "../../../configs/jwt.configs.js"

import express from "express"

const Router = express.Router()

Router.get("/list/:user_id",
    verifyAccessToken,
    validateCartMiddleware,
    CartController.getCartItems
)

Router.post("/add/:user_id",
    verifyAccessToken,
    validateCartMiddleware,
    CartController.addItemInCart
)

Router.delete("/delete/:user_id/:book_id",
    verifyAccessToken,
    validateCartMiddleware,
    CartController.deleteItemInCart
)


export default Router