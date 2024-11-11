import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comment';

const checkCommentOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { commentId } = req.params;
    const user = req.user as any;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        if (comment.author !== user._id) {
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