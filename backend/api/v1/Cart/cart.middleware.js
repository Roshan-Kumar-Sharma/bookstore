import createHttpError from "http-errors"

const validateCartMiddleware = async (req, res, next) => {
    try {
        let { user_id: token_user_id } = { ...req.payload }

        let { user_id } = req.params

        user_id = parseInt(user_id)

        if (user_id !== token_user_id) throw createHttpError.Unauthorized("Invalid user")

        next();
    } catch (err) {
        if (err.isJoi) {
            return next(createHttpError.BadRequest(err.message));
        }
        return next(err);
    }
}

export { validateCartMiddleware }
