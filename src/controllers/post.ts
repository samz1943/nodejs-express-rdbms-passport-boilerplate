import { Request, Response } from 'express';
import logger from '../utils/logger';
import { postResponse, responseFormatter } from '../utils/responseFormatter';
import Post from '../models/Post';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { title, content } = req.body;
        const reqUser = req.user as any;

        const post = new Post({
            title,
            content,
            author: reqUser._id,
        });

        await post.save();
        await post.populate('author');
        
        const formattedPost = postResponse(post);

        const response = responseFormatter(201, formattedPost, 'Post created successfully');

        logger.info(response.data);
        res.status(201).json(response);
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate('author');

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const formattedPost = postResponse(post);
        const response = responseFormatter(200, formattedPost);

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search = req.query.title ? { title: { $regex: req.query.title, $options: 'i' } } : {};

        const posts = await Post.find(search)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })  // Sort by createdAt descending
        .populate('author')
        .exec();

        const totalCount = await Post.countDocuments(search).exec();

        const formattedData = posts.map((post) => postResponse(post));

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

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { postId } = req.params;
        const { title, content } = req.body;

        const post = await Post.findById(postId).populate('author');

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        post.title = title;
        post.content = content;
        await post.save();

        const formattedPost = postResponse(post);
        const response = responseFormatter(200, formattedPost);

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { postId } = req.params;

        const post = await Post.findByIdAndDelete(postId).exec();
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        res.status(204).json();
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};