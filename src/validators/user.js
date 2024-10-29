const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .required(),

    repeat_password: Joi.ref('password'),
});

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = validateUser;
