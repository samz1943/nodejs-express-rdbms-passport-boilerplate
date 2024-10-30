const logger = require('../utils/logger');
const { User, Post, Comment } = require('../models');
const { Op } = require('sequelize');
const { commentResponse, responseFormatter} = require('../utils/responseFormatter');
const paginate = require('../utils/pagination');

exports.createComment = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { id } = req.params;
        const { content } = req.body;
        const user = req.user;

        console.log('post', id)

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