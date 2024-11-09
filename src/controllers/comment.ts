import { Request, Response } from 'express';
import logger from '../utils/logger';
import { commentResponse, responseFormatter } from '../utils/responseFormatter';
import { PaginationService } from '../utils/pagination.service';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Comment } from '../entities/Comment';

export const createComment = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const reqUser = req.user as User;

        const comment = new Comment();
        comment.content = content;
        comment.user_id = reqUser.id;
        comment.post_id = parseInt(postId);

        const commentRepository = AppDataSource.getRepository(Comment);
        await commentRepository.save(comment);
        
        const user = await comment.user;
        const post = await comment.post;
        const formattedComment = commentResponse({ ...comment, user, post });

        const response = responseFormatter(201, formattedComment, 'Comment created successfully');

        logger.info(response.data);
        res.status(201).json(response);
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

export const getCommentById = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { commentId } = req.params;

        const commentRepository = AppDataSource.getRepository(Comment);
        const comment = await commentRepository.findOne({
            where: { id: parseInt(commentId) },
            relations: { user: true },
        });

        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        const user = await comment.user;
        const formattedComment = commentResponse({ ...comment, user });

        const response = responseFormatter(200, formattedComment);

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const getPostComments = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { postId } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const commentRepository = AppDataSource.getRepository(Comment);

        const result = await PaginationService.paginate(commentRepository, {
            page,
            limit,
            where: { post_id: postId },
            orderBy: 'createdAt',
            orderDirection: 'DESC',
        });

        const formattedData = await Promise.all(result.data.map(async comment => {
            const user = await comment.user;
            return commentResponse({ ...comment, user })
        }));

        const response = {
            ...result,
            data: formattedData
        };

        res.status(200).json(response);
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        const commentRepository = AppDataSource.getRepository(Comment);
        const comment = await commentRepository.findOne({
            where: { id: parseInt(commentId) },
            relations: { user: true },
        });

        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        comment.content = content;
        await commentRepository.save(comment);

        const user = await comment.user;
        const formattedComment = commentResponse({ ...comment, user });
        const response = responseFormatter(200, formattedComment);

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { commentId } = req.params;

        const commentRepository = AppDataSource.getRepository(Comment);
        await commentRepository.delete(commentId);

        // logger.info(response.data);
        res.status(204).json();
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};