import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';
import logger from '../utils/logger';
import transporter from '../config/email';
import verificationEmail from '../utils/emailTemplate';
import { responseFormatter } from '../utils/responseFormatter';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
  id: number;
  email: string;
}

const generateAccessToken = (user: UserPayload): string => {
    return jwt.sign({ id: user.id, email: user.email }, config.jwt_secret, {
      expiresIn: config.access_token_expiry,
    });
  };
  
  const generateRefreshToken = (user: UserPayload): string => {
    return jwt.sign({ id: user.id }, config.jwt_refresh_secret, {
      expiresIn: config.refresh_token_expiry,
    });
  };

export const login = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
        const { email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email: email });
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

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.verificationToken = hashedToken;
    user.tokenExpiration = new Date(Date.now() + 3600000);

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);

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

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email: email });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    };

    const isMatch = await bcrypt.compare(token, user.verificationToken as string);
    if (!isMatch) {
      res.status(401).json({ message: 'Incorrect token' });
      return;
    }

    user.isVerified = true;
    user.verificationToken = null,
    await userRepository.save(user);

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