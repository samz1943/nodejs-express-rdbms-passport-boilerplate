const logger = require('../utils/logger');
const { User } = require('../models');
const { Op } = require('sequelize');
const { userResponse, responseFormatter} = require('../utils/responseFormatter');
const paginate = require('../utils/pagination');

exports.getSelf = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const user = req.user;

        const userDB = await User.findByPk(user.id);

        if (!userDB) {
            return res.status(404).json({ error: 'User not found' });
        }

        const formattedUser = userResponse(userDB);
        const response = responseFormatter(200, formattedUser);

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const formattedUser = userResponse(user);
        const response = responseFormatter(200, formattedUser);

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { page = 1, limit = 10, username } = req.query;

        const query = {};
        if (username) {
            query.username = { [Op.like]: `%${username}%` };
        }

        const paginationResult = await paginate(User, query, page, limit);
        res.status(200).json(paginationResult);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { userId } = req.params;
        const { username } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username;
        user.save();

        const formattedUser = userResponse(user);
        const response = responseFormatter(200, formattedUser);

        logger.info(response.data);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.destroy();

        // logger.info(response.data);
        res.status(204).json();
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};
