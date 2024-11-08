import { Repository, EntityTarget, SelectQueryBuilder, EntityManager, ObjectLiteral } from 'typeorm';
import { FindManyOptions, Like } from 'typeorm';

interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  where?: ObjectLiteral;  // Use ObjectLiteral for where clause
}

export class PaginationService {
  /**
   * A generic pagination function that works for any entity.
   *
   * @param repository - The repository of the entity you want to paginate.
   * @param options - The pagination options (page, limit, optional filters and sorting).
   * @returns The paginated results.
   */
  static async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    options: PaginationOptions
  ): Promise<{ data: T[]; meta: { totalItems: number; totalPages: number; currentPage: number; itemsPerPage: number } }> {
    const { page, limit, orderBy = 'id', orderDirection = 'ASC', where = {} } = options;

    const skip = (page - 1) * limit;

    const queryBuilder = repository.createQueryBuilder();

    // Apply the "where" conditions if provided
    queryBuilder.where(where);

    // Apply the sorting order
    queryBuilder.orderBy(orderBy, orderDirection);

    // Get the results using skip and take
    const [data, totalItems] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }
}
