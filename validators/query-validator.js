const Joi = require('joi');

const querySchema = Joi.object({
    size: Joi.number().integer().min(1).max(100).default(5),
    page: Joi.number().integer().default(0),
});

module.exports = querySchema;
