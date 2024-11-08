import { Request, Response } from 'express';
import logger from '../utils/logger';
import { responseFormatter } from '../utils/responseFormatter';
import { PaginationService } from '../utils/pagination.service';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Like } from 'typeorm';

export const getSelf = async (req: Request, res: Response): Promise<void> => {
  logger.http(`${req.method} ${req.url}`);
  try {
    const reqUser = req.user as User;

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ id: reqUser.id });
    const response = responseFormatter(200, user);

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
    const user = await userRepository.findOneBy({ id: parseInt(userId) });

    const response = responseFormatter(200, user);

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

    res.status(200).json(result);
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
    const user = await userRepository.findOneBy({ id: parseInt(userId) })

    user!.username = username;
    await userRepository.save(user!);

    const response = responseFormatter(200, user);

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
