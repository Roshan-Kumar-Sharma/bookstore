import * as UserController from "./users.controllers.js"
import { validateUserMiddleware } from "./users.middleware.js"
import { verifyAccessToken } from "../../../configs/jwt.configs.js"

import express from "express"

const Router = express.Router()

Router.get("/list", UserController.getAllUsers)

Router.post("/create", validateUserMiddleware, UserController.createUser)
Router.post("/login", validateUserMiddleware, UserController.loginUser)

Router.delete("/logout", UserController.logoutUser)


// Router.post("/createUser",
//     ApiV1Middleware.validate(UserSchema.createUserSchema), UserController.createUser
// )

export default Router