const config = require('../config/config')
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, config.jwt_secret, {
      expiresIn: config.access_token_expiry,
    });
  };
  
  const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, config.jwt_refresh_secret, {
      expiresIn: config.refresh_token_expiry,
    });
  };

exports.login = async (req, res) => {
  logger.http(`${req.method} ${req.url}`);
  try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ accessToken, refreshToken });
    } catch (err) {
        logger.error(`Error: ${err.message}`);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.refreshToken = async (req, res) => {
    logger.http(`${req.method} ${req.url}`);
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, config.jwt_refresh_secret, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        res.json({ accessToken, refreshToken });
    });
};