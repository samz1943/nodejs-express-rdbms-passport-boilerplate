const Joi = require('joi');

const authSchema = Joi.object({
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

    repeat_password: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .label('Repeat password')
        .messages({ 'any.only': 'Repeat password must match password' }),
});

const validateAuth = (req, res, next) => {
    const { error } = authSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = validateAuth;
