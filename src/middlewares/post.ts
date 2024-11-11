import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';

const checkPostOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { postId } = req.params;
    const user = req.user as any;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        if (post.author !== user._id) {
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