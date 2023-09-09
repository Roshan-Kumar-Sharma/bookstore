import createHttpError from "http-errors"
import bcrypt from "bcrypt"
import User from "./users.models.js"
import { signAccessToken, signRefreshToken, decodeToken } from "../../../configs/jwt.configs.js"

const getAllUsers = async (req, res, next) => {
    try {
        let users = await User.find({}, { email: 1, user_id: 1 }).sort({ user_id: 1 })

        users = users.map(user => {
            let { email, user_id } = user
            return { email, user_id }
        })

        res.status(200).json({
            status: true,
            message: "Fetched all users",
            data: users
        })
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).json({
            status: false,
            message: err.message || "Something broke. Try again later."
        })
    }
}

const createUser = async (req, res, next) => {
    try {
        let user_id = undefined
        const { email, password } = req.validation

        let user = await User.findOne({ email })
        if (user) throw createHttpError.Conflict("User with this email already exists")

        user = await User.findOne({}).sort({ user_id: -1 })
        if (!user) user_id = 1
        else user_id = user.user_id + 1

        const access_token = await signAccessToken({ email, user_id })
        const refresh_token = await signRefreshToken({ email, user_id })

        user = new User({ user_id, email, password, access_token, refresh_token })

        const doc = await user.save()

        console.log(doc)

        res.status(200).json({
            status: true,
            message: "User registered successfully",
            data: {
                access_token,
                refresh_token
            }
        })
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).json({
            status: false,
            message: err.message || "Something broke. Try again later."
        })
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.validation

        let user = await User.findOne({ email })
        if (!user) throw createHttpError.Conflict("No user with this email exists")

        let isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) throw createHttpError.BadRequest("Invalid password")

        const access_token = await signAccessToken({ email, user_id: user.user_id })
        const refresh_token = await signRefreshToken({ email, user_id: user.user_id })

        let doc = await User.updateOne({ email }, { access_token, refresh_token }, { new: true })

        console.log(doc)

        res.status(200).json({
            status: true,
            message: "User logged in successfully",
            data: {
                access_token,
                refresh_token
            }
        })
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).json({
            status: false,
            message: err.message || "Something broke. Try again later."
        })
    }
}

const logoutUser = async (req, res, next) => {
    try {
        let { user_id, email } = req.payload

        let user = await User.findOne({ user_id, email })

        if (!user) throw createHttpError.NotFound("User not found")

        let doc = await User.updateOne({ user_id, email }, { $unset: { access_token: 1, refresh_token: 1 } }, { new: true })

        console.log(doc)

        res.status(200).json({
            status: true,
            message: "User logged out"
        })
    } catch (err) {
        res.status(err.status || 500).json({
            status: false,
            message: err.message || "Something broke. Try again later."
        })
    }
}

export {
    getAllUsers,
    createUser,
    loginUser,
    logoutUser
}