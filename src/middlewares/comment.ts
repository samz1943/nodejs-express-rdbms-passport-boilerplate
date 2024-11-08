import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Comment } from '../entities/Comment';

const checkCommentOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { commentId } = req.params;
    const user = req.user as User;

    try {
        const commentRepository = AppDataSource.getRepository(Comment);
        const comment = await commentRepository.findOne({where: { id: parseInt(commentId) }});

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