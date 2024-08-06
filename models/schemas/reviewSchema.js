const Joi = require("joi");

const reviewSchemaJoi = Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
});

module.exports = reviewSchemaJoi;
