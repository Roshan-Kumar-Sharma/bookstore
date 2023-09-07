import * as OrderController from "./order.controllers.js"
import { validateOrderMiddleware } from "./order.middleware.js"
import { verifyAccessToken } from "../../../configs/jwt.configs.js"

import express from "express"

const Router = express.Router()

Router.get("/history/:user_id",
    verifyAccessToken,
    validateOrderMiddleware,
    OrderController.getOrderHistory
)

Router.post("/create/:user_id",
    verifyAccessToken,
    validateOrderMiddleware,
    OrderController.createOrder
)

export default Router