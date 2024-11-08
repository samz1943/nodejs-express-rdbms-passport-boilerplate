import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Post } from '../entities/Post';

const checkPostOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { postId } = req.params;
    const user = req.user as User;

    try {
        const postRepository = AppDataSource.getRepository(Post);
        const post = await postRepository.findOne({where: { id: parseInt(postId) }});

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