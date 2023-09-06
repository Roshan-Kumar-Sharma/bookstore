import jwt from "jsonwebtoken"
import createHttpError from "http-errors"
import envs from "./secret.js"

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = envs

const signAccessToken = (payload) => {
    return new Promise((resolve, reject) => {
        const secret = ACCESS_TOKEN_SECRET;

        const options = {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        };

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                return reject(createHttpError.InternalServerError());
            }
            resolve(token);
        });
    });
}

const verifyAccessToken = (req, res, next) => {
    if (!req.headers.authorization)
        return next(createHttpError.Unauthorized());

    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.name !== "JsonWebTokenError")
                return next(createHttpError.Unauthorized(err.message));

            return next(createHttpError.Unauthorized());
        }

        req.payload = payload;
        next();
    });
}

const signRefreshToken = (payload) => {
    return new Promise((resolve, reject) => {

        const secret = REFRESH_TOKEN_SECRET;

        const options = {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        };

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                return reject(createHttpError.InternalServerError());
            }
            resolve(token);
        });
    });
}

const verifyRefreshToken = (req, res, next) => {
    if (!req.headers.authorization)
        return next(createHttpError.Unauthorized());

    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    jwt.verify(token, REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.name !== "JsonWebTokenError")
                return next(createHttpError.Unauthorized(err.message));

            return next(createHttpError.Unauthorized());
        }

        req.payload = payload;
        next();
    });
}

const decodeToken = (token) => {
    const data = jwt.decode(token, { complete: true })
    return data
}

export {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    decodeToken
}