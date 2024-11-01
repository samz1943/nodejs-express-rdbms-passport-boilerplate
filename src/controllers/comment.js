const logger = require('../utils/logger');
const { User, Post, Comment } = require('../models');
const { commentResponse, responseFormatter} = require('../utils/responseFormatter');
const paginate = require('../utils/pagination');

exports.createComment = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { id } = req.params;
        const { content } = req.body;
        const user = req.user;

        const comment = await Comment.create({ content, post_id: id, user_id: user.id });

        const post = await Post.findByPk(id, {
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
            }
        });
        
        const formattedComment = commentResponse({ ...comment.toJSON(), user, post });

        const response = responseFormatter(201, formattedComment, 'Comment created successfully');

        logger.info(response.data);
        res.status(201).json(response);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.getCommentById = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { commentId } = req.params;

        const comment = await Comment.findByPk(commentId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
                },
            ],
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const formattedComment = commentResponse(comment);
        const response = responseFormatter(200, formattedComment);

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getPostComments = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { page = 1, limit = 10 } = req.query;

        const query = {};

        const paginationResult = await paginate(Comment, query, page, limit);
        const formattedComments = await Promise.all(
            paginationResult.items.map(async (comment) => {
                const user = await User.findByPk(comment.user_id, {
                    attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
                });
                return commentResponse({ ...comment.toJSON(), user });
            })
        );

        const response = responseFormatter(200, formattedComments, 'Comments retrieved successfully', {
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

exports.updateComment = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { commentId } = req.params;
        const { title, content } = req.body;

        const comment = await Comment.findByPk(commentId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
                },
            ],
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        comment.title = title;
        comment.content = content;
        comment.save();

        const formattedComment = commentResponse(comment);
        const response = responseFormatter(200, formattedComment);

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { commentId } = req.params;

        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        comment.destroy();

        // logger.info(response.data);
        res.status(204).json();
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};