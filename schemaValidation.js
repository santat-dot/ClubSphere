const Joi = require('joi');

const listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required().max(255),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        price:Joi.number().required().min(0),
        country:Joi.string().required(),

    })
})



const reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required().max(255),
    })
})

module.exports={listingSchema,reviewSchema};
