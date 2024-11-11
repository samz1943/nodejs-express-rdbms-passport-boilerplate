import { Request, Response } from 'express';
import logger from '../utils/logger';
import { commentResponse, responseFormatter } from '../utils/responseFormatter';
import Comment from '../models/Comment';

export const createComment = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const reqUser = req.user as any;

        const comment = new Comment({
            content,
            author: reqUser._id,
            post: postId,
        });

        await comment.save();
        await comment.populate('author');

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

        const comment = await Comment.findById(commentId).populate('author');

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

        const comments = await Comment.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })  // Sort by createdAt descending
        .populate('author')
        .exec();

        const totalCount = await Comment.countDocuments().exec();

        const formattedData = comments.map((comment) => commentResponse(comment));

        const response = {
            data: formattedData,
            totalCount,
            page,
            limit,
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

        const comment = await Comment.findById(commentId).populate('author');

        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        comment.content = content;
        await comment.save();

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

        const comment = await Comment.findByIdAndDelete(commentId).exec();
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        res.status(204).json();
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};