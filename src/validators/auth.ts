import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';

const authSchema: ObjectSchema = Joi.object({
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

const validateAuth = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = authSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export default validateAuth;
