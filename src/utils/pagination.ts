import { Model, FindAndCountOptions, Includeable, Op } from 'sequelize';

// Define the result format for pagination
interface PaginateResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface PaginateOptions {
  query?: Record<string, any>;
  page?: number;
  limit?: number;
  include?: Includeable[];
}

const paginate = async <T extends Model>(
  model: { findAndCountAll: (options: FindAndCountOptions) => Promise<{ count: number; rows: T[] }> },  // Updated to use the correct model type
  { query = {}, page = 1, limit = 10, include = [] }: PaginateOptions
): Promise<PaginateResult<T>> => {
  // Parse page and limit to numbers, ensuring they're within acceptable bounds
  const pageNum = Math.max(1, parseInt(page.toString(), 10));  // Ensure page starts from 1
  const limitNum = Math.min(100, Math.max(1, parseInt(limit.toString(), 10)));  // Limit between 1 and 100

  const offset = (pageNum - 1) * limitNum;

  // Prepare the options object for Sequelize query
  const options: FindAndCountOptions = {
    where: query,
    limit: limitNum,
    offset,
    include,
  };

  // Perform the database query with pagination
  const { count, rows } = await model.findAndCountAll(options);

  // Calculate total pages and return the result
  return {
    data: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limitNum),
    currentPage: pageNum,
  };
};

export default paginate;
