import { Request, Response } from 'express';
import logger from '../utils/logger';
import { responseFormatter, userResponse } from '../utils/responseFormatter';
import { PaginationService } from '../utils/pagination.service';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Like } from 'typeorm';

export const getSelf = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
    const reqUser = req.user as User;

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneByOrFail({ id: reqUser.id });
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

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneByOrFail({ id: parseInt(userId) });
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

    const userRepository = AppDataSource.getRepository(User);

    const search = req.query.username ? `%${req.query.username}%` : undefined;

    const result = await PaginationService.paginate(userRepository, {
        page,
        limit,
        where: search ? { username: Like(search) } : {},
        orderBy: 'createdAt',
        orderDirection: 'DESC',
    });

    const formattedData = result.data.map(user => userResponse(user));

    const response = {
      ...result,
      data: formattedData
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

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneByOrFail({ id: parseInt(userId) })

    user.username = username;
    await userRepository.save(user!);

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

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete(userId);

    res.status(204).json();
  } catch (error: any) {
    logger.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
