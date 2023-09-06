import mongoose from "mongoose";
import envs from "./secret.js"

const { DB_URI, DB } = envs

const DB_CONNECTION = mongoose.createConnection(DB_URI)

DB_CONNECTION.on("connected", () => {
    console.log(
        `SUCCESSFULLY established connection with database : ${DB_CONNECTION._connectionString}`
    );
});

DB_CONNECTION.on("error", (err) => {
    console.log(err);
});

DB_CONNECTION.on("disconnected", () => {
    console.log("Connection terminated with database SUCCESSFULLY!");
});

process.on("SIGINT", async () => {
    await DB_CONNECTION.close();
    process.exit(0);
});

export { DB_CONNECTION }