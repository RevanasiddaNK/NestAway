const Joi = require("joi");

const listingSchemaJoi = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required(),
    filterType : Joi.string().required(),
});

module.exports = listingSchemaJoi;
