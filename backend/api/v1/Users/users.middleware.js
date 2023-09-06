import createHttpError from "http-errors"
import { validateUser } from "./users.validation.js"

const validateUserMiddleware = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const validationResult = await validateUser.validateAsync({ email, password });

        req.validation = validationResult
        
        next();
    } catch (err) {
        if (err.isJoi) {
            return next(createHttpError.BadRequest(err.message));
        }
        return next(err);
    }
}

export { validateUserMiddleware }
