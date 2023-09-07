import Joi from "joi"

const validateBook = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    publisher: Joi.string().required(),
    genre: Joi.string().required(),
    price: Joi.number().required(),
    availability: Joi.date().allow(null).required()
});

export { validateBook };
