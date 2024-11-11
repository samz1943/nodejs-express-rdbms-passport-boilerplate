import { Request, Response } from 'express';
import logger from '../utils/logger';
import { responseFormatter, userResponse } from '../utils/responseFormatter';
import User from '../models/User';

export const getSelf = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
    const reqUser = req.user as any;

    const user = await User.findById(reqUser.id);
    const formattedUser = userResponse(user);
    const response = responseFormatter(200, formattedUser);

    logger.info(response.data);
    res.status(200).json(response);
  } catch (error: any) {
    logger.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
    const { userId } = req.params;

    const user = await User.findById(userId );
    const formattedUser = userResponse(user);
    const response = responseFormatter(200, formattedUser);

    logger.info(response.data);
    res.status(200).json(response);
  } catch (error: any) {
    logger.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.username ? { username: { $regex: req.query.username, $options: 'i' } } : {};

    const users = await User.find(search)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })  // Sort by createdAt descending
      .exec();

    const totalCount = await User.countDocuments(search).exec();

    const formattedData = users.map((user) => userResponse(user));

    const response = {
      data: formattedData,
      totalCount,
      page,
      limit,
    };

    res.status(200).json(response);
  } catch (error: any) {
    logger.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
    const { userId } = req.params;
    const { username } = req.body;

    const user = await User.findById(userId).exec();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.username = username;
    await user.save();

    const formattedUser = userResponse(user);
    const response = responseFormatter(200, formattedUser);

    logger.info(response.data);
    res.status(200).json(response);
  } catch (error: any) {
    logger.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId).exec();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(204).json();
  } catch (error: any) {
    logger.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
