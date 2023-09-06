import createHttpError from "http-errors"
import { validateBook } from "./books.validation.js"

const validateBookMiddleware = async (req, res, next) => {
    try {
        const body = { ...req.body }

        const validationResult = await validateBook.validateAsync(body);

        req.validation = validationResult

        next();
    } catch (err) {
        if (err.isJoi) {
            return next(createHttpError.BadRequest(err.message));
        }
        return next(err);
    }
}

export { validateBookMiddleware }
