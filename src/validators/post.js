const Joi = require('joi');

const postSchema = Joi.object({
    title: Joi.string()
        .min(4)
        .required(),

    content: Joi.string()
        .min(4)
        .required(),
});

const validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = validatePost;
