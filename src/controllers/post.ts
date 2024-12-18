import { Request, Response } from 'express';
import logger from '../utils/logger';
import { postResponse, responseFormatter } from '../utils/responseFormatter';
import { PaginationService } from '../utils/pagination.service';
import { Like } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { title, content } = req.body;
        const reqUser = req.user as User;

        const post = new Post();
        post.title = title;
        post.content = content;
        post.user_id = reqUser.id;

        const postRepository = AppDataSource.getRepository(Post);
        await postRepository.save(post);
        
        const user = await post.user;
        const formattedPost = postResponse({ ...post, user });

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

        const postRepository = AppDataSource.getRepository(Post);
        const post = await postRepository.findOne({
            where: { id: parseInt(postId) },
            relations: { user: true },
        });

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const user = await post.user;
        const formattedPost = postResponse({ ...post, user });
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

        const postRepository = AppDataSource.getRepository(Post);

        const search = req.query.title ? `%${req.query.title}%` : undefined;

        const result = await PaginationService.paginate(postRepository, {
            page,
            limit,
            where: search ? { title: Like(search) } : {},
            orderBy: 'createdAt',
            orderDirection: 'DESC',
        });

        const formattedData = await Promise.all(result.data.map(async post => {
            const user = await post.user;
            return postResponse({ ...post, user })
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

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { postId } = req.params;
        const { title, content } = req.body;

        const postRepository = AppDataSource.getRepository(Post);
        const post = await postRepository.findOne({
            where: { id: parseInt(postId) },
            relations: { user: true },
        });

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        post.title = title;
        post.content = content;
        await postRepository.save(post);

        const user = await post.user;
        const formattedPost = postResponse({ ...post, user });
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

        const postRepository = AppDataSource.getRepository(Post);
        await postRepository.delete(postId);

        res.status(204).json();
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};