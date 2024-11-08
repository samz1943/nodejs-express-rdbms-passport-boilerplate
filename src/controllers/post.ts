import { Request, Response } from 'express';
import logger from '../utils/logger';
// import User from '../models/user';
// import Post from '../models/post';
import { Op } from 'sequelize';
import { postResponse, responseFormatter } from '../utils/responseFormatter';
import paginate from '../utils/pagination';
import { PaginationService } from '../utils/pagination.service';
import { Like } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { title, content } = req.body;
        const user = req.user as User;

        const post = new Post();
        post.title = title;
        post.content = content;
        post.user_id = user.id;

        const postRepository = AppDataSource.getRepository(Post);
        await postRepository.save(post);

        // const post = await Post.create({ title, content, user_id: user.id });
        
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

        const postRepository = AppDataSource.getRepository(Post);
        const post = await postRepository.findOne({
            where: { id: parseInt(postId) },
            relations: { user: true },
        });

        // const post = await Post.findByPk(postId, {
        //     include: {
        //         model: User,
        //         as: 'user',
        //         attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        //     }
        // });

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
        // const title = req.query.title as string | undefined;

        // const query: Record<string, any> = {};

        // if (title) {
        //     query.title = { [Op.like]: `%${title}%` };
        // }

        // const include = [
        //     {
        //         model: User,
        //         as: 'user',
        //         attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        //     },
        // ];

        // const paginationResult = await paginate(Post, { query, page, limit, include });
        // const formattedPosts = paginationResult.data.map(postResponse);

        // const response = {
        //     data: formattedPosts,
        //     totalItems: paginationResult.totalItems,
        //     totalPages: paginationResult.totalPages,
        //     currentPage: paginationResult.currentPage,
        // };

        const postRepository = AppDataSource.getRepository(Post);

        const search = req.query.title ? `%${req.query.title}%` : undefined;

        const result = await PaginationService.paginate(postRepository, {
            page,
            limit,
            where: search ? { title: Like(search) } : {},
            orderBy: 'createdAt',
            orderDirection: 'DESC',
        });

        res.status(200).json(result);
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

        // const post = await Post.findByPk(postId, {
        //     include: {
        //         model: User,
        //         as: 'user',
        //         attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        //     }
        // });

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        post.title = title;
        post.content = content;
        await postRepository.save(post);

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

        // const post = await Post.findByPk(postId);

        const postRepository = AppDataSource.getRepository(Post);
        await postRepository.delete(postId);

        // logger.info(response.data);
        res.status(204).json();
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};