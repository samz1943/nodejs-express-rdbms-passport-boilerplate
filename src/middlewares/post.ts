import { Request, Response, NextFunction } from 'express';
import Post from "../models/post";
import User from '../models/user';

const checkPostOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { postId } = req.params;
    const user = req.user as User;

    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        if (post.user_id !== user.id) {
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

export default checkPostOwner;