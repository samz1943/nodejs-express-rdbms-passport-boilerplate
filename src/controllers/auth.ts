import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';
import logger from '../utils/logger';
import transporter from '../config/email';
import verificationEmail from '../utils/emailTemplate';
import { responseFormatter } from '../utils/responseFormatter';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
  id: number;
  email: string;
}

const generateAccessToken = (user: IUser): string => {
    return jwt.sign({ id: user.id, email: user.email }, config.jwt_secret, {
      expiresIn: config.access_token_expiry,
    });
  };
  
  const generateRefreshToken = (user: IUser): string => {
    return jwt.sign({ id: user.id }, config.jwt_refresh_secret, {
      expiresIn: config.refresh_token_expiry,
    });
  };

export const login = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email }).exec();
        if (!user) {
          res.status(401).json({ message: 'User not found' });
          return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.status(401).json({ message: 'Incorrect password' });
          return;
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ accessToken, refreshToken });
    } catch (error: any) {
      logger.error(`Error: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedToken = await bcrypt.hash(token, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      verification_token: hashedToken,
      token_expiration: new Date(Date.now() + 3600000),
    });

    await user.save();

    const mailOptions = {
      from: '"My App" <your-email@gmail.com>',
      to: email,
      subject: verificationEmail(username, token).subject,
      text: verificationEmail(username, token).text,
      html: verificationEmail(username, token).html,
    };

    if (process.env.NODE_ENV !== 'test') {
      await transporter.sendMail(mailOptions);
    }

    const response = responseFormatter(201, null, 'User registered successfully');

    logger.info(response.data);
    res.status(201).json(response);
  } catch (error: any) {
    logger.error(`Error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const verify = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
    const { email, token } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    };

    const isMatch = await bcrypt.compare(token, user.verification_token as string);
    if (!isMatch) {
      res.status(401).json({ message: 'Incorrect token' });
      return;
    }

    user.is_verified = true;
    user.verification_token = null,
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (error: any) {
    logger.error(`Error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(refreshToken, config.jwt_refresh_secret, (err: any, user: any) => {
    if (err) {
      res.sendStatus(403);
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    res.json({ accessToken, refreshToken });
  });
};