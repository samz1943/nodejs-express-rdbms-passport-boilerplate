const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config')
const logger = require('../utils/logger');
const transporter = require('../config/email');
const { verificationEmail } = require('../utils/emailTemplate');
const { responseFormatter} = require('../utils/responseFormatter');
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

exports.register = async (req, res) => {
  logger.http(`${req.method} ${req.url}`);
  try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedToken = await bcrypt.hash(token, 10);

      await User.create({
        username,
        email,
        password: hashedPassword,
        verificationToken: hashedToken,
        tokenExpiration: new Date(Date.now() + 3600000),
      });

      const mailOptions = {
        from: '"My App" <your-email@gmail.com>',
        to: email,
        subject: verificationEmail(username, token).subject,
        text: verificationEmail(username, token).text,
        html: verificationEmail(username, token).html,
      };

      await transporter.sendMail(mailOptions);

      const response = responseFormatter(201, null, 'User registered successfully');

      logger.info(response.data);
      res.status(201).json(response);
  } catch (error) {
      logger.error(`Error: ${error.message}`);
      res.status(400).json({ error: error.message });
  }
};

exports.verify = async (req, res) => {
  logger.http(`${req.method} ${req.url}`);
  try {
      const { email, token } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(token, user.verificationToken);
      if (!isMatch) return res.status(401).json({ message: 'Incorrect token' });

      user.isVerified = true;
      user.verificationToken = null,
      user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({ accessToken, refreshToken });
  } catch (error) {
      logger.error(`Error: ${error.message}`);
      res.status(400).json({ error: error.message });
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