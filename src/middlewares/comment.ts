import { Request, Response, NextFunction } from 'express';
import Comment from "../models/comment";
import User from '../models/user';

const checkCommentOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { commentId } = req.params;
    const user = req.user as User;

    try {
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        if (comment.user_id !== user.id) {
            res.status(403).json({ error: 'You are not authorized to perform this action' });
            return;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};

export default checkCommentOwner;