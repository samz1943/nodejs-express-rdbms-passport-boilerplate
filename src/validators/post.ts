import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';

const postSchema = Joi.object({
    title: Joi.string()
        .min(4)
        .required(),

    content: Joi.string()
        .min(4)
        .required(),
});

const validatePost = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export default validatePost;
