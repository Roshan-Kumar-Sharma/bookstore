import Joi from "joi"

const customFields = {
    email: Joi.string().email({ tlds: { allow: true } }).lowercase(),
    password: Joi.string().pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])")
    ).trim().min(4).max(20).messages({ "string.pattern.base": "Password must be atleast 4 characters long, with a mix of uppercase, lowercase, number and special characters" }).required()
};

const validateUser = Joi.object({
    email: customFields.email.required(),
    password: customFields.password.required()
});

export { validateUser };
