import express from "express";
import envs from "./configs/secret.js"

const app = express()

import ServerRoutes from "./routes/server.routes.js"
import "./configs/db.configs.js";
import serverConfig from "./configs/server.configs.js"

serverConfig(app)
ServerRoutes(app)

app.use((err, req, res, next) => {
    res.status(err.statusCode || err.code || 500).json({
        status: false,
        message: err.message || "Internal Server Error"
    })
})

const { PORT } = envs
async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`Server is listening at PORT:::::${PORT}`)
        })
    } catch (err) {
        console.log("Server failed to start")
    }
}

startServer()