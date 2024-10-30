const Joi = require('joi');

const commentSchema = Joi.object({
    content: Joi.string()
        .required(),
});

const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = validateComment;