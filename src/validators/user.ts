import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';

const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .required(),
});

const validateUser = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export default validateUser;
