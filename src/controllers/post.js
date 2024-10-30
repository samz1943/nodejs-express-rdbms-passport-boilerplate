const logger = require('../utils/logger');
const { User, Post } = require('../models');
const { Op } = require('sequelize');
const { postResponse, responseFormatter} = require('../utils/responseFormatter');
const paginate = require('../utils/pagination');

exports.createPost = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { title, content } = req.body;
        const user = req.user;

        const post = await Post.create({ title, content, user_id: user.id });
        
        const formattedPost = postResponse({ ...post.toJSON(), user });

        const response = responseFormatter(201, formattedPost, 'Post created successfully');

        logger.info(response.data);
        res.status(201).json(response);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { id } = req.params;

        const post = await Post.findByPk(id, {
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
            }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const formattedPost = postResponse(post);
        const response = responseFormatter(200, formattedPost);

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { page = 1, limit = 10, title } = req.query;

        const query = {};
        if (title) {
            query.title = { [Op.like]: `%${title}%` };
        }

        const paginationResult = await paginate(Post, query, page, limit);
        const formattedPosts = await Promise.all(
            paginationResult.items.map(async (post) => {
                const user = await User.findByPk(post.user_id, {
                    attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
                });
                return postResponse({ ...post.toJSON(), user });
            })
        );

        const response = responseFormatter(200, formattedPosts, 'Posts retrieved successfully', {
            totalItems: paginationResult.totalItems,
            totalPages: paginationResult.totalPages,
            currentPage: paginationResult.currentPage,
        });

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};