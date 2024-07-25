const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().allow(null, ''),
            filename: Joi.string().allow(null, ''),
        }).allow(null, ''),
        category: Joi.string().valid("Farm","Rooms", "Iconic-Cities", "Mountains", "Beach").required(),
    }).required(),
}).unknown(true);

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required(),
});