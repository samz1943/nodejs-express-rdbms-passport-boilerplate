import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';

const commentSchema = Joi.object({
    content: Joi.string()
        .required(),
});

const validateComment = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export default validateComment;