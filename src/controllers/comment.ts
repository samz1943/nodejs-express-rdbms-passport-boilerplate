import { Request, Response } from 'express';
import logger from '../utils/logger';
// import User from '../models/user';
// import Post from '../models/post';
// import Comment from '../models/comment';
import { commentResponse, responseFormatter } from '../utils/responseFormatter';
import paginate from '../utils/pagination';
import { PaginationService } from '../utils/pagination.service';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Comment } from '../entities/Comment';

export const createComment = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const user = req.user as User;

        const comment = new Comment();
        comment.content = content;
        comment.user_id = user.id;
        comment.post_id = parseInt(postId);

        const commentRepository = AppDataSource.getRepository(Comment);
        await commentRepository.save(comment);

        // const comment = await Comment.create({ content, post_id: parseInt(postId), user_id: user.id });

        // const post = await Post.findByPk(postId, {
        //     include: {
        //         model: User,
        //         as: 'user',
        //         attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        //     }
        // });
        
        const formattedComment = commentResponse(comment);

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

        // const comment = await Comment.findByPk(commentId, {
        //     include: [
        //         {
        //             model: User,
        //             as: 'user',
        //             attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        //         },
        //     ],
        // });

        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        const formattedComment = commentResponse(comment);
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

        // const query: Record<string, any> = { post_id: postId };

        const commentRepository = AppDataSource.getRepository(Comment);

        // const search = req.query.title ? `%${req.query.title}%` : undefined;

        const result = await PaginationService.paginate(commentRepository, {
            page,
            limit,
            where: { post_id: postId },
            orderBy: 'createdAt',
            orderDirection: 'DESC',
        });

        res.status(200).json(result);

        // const include = [
        //     {
        //         model: User,
        //         as: 'user',
        //         attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        //     },
        // ];

        // const paginationResult = await paginate(Comment, { query, page, limit, include});
        // const formattedComments = paginationResult.data.map(commentResponse);

        // const response = {
        //     data: formattedComments,
        //     totalItems: paginationResult.totalItems,
        //     totalPages: paginationResult.totalPages,
        //     currentPage: paginationResult.currentPage,
        // };

        // res.status(200).json(response);
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

        // const comment = await Comment.findByPk(commentId, {
        //     include: [
        //         {
        //             model: User,
        //             as: 'user',
        //             attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        //         },
        //     ],
        // });

        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        comment.content = content;
        await commentRepository.save(comment);

        const formattedComment = commentResponse(comment);
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

        // const comment = await Comment.findByPk(commentId);

        // if (!comment) {
        //     res.status(404).json({ error: 'Comment not found' });
        //     return;
        // }

        // comment.destroy();

        const commentRepository = AppDataSource.getRepository(Comment);
        await commentRepository.delete(commentId);

        // logger.info(response.data);
        res.status(204).json();
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};