const paginate = async (model, query = {}, page = 1, limit = 10, include = []) => {
  const pageNum = Math.max(0, parseInt(page));
  const limitNum = Math.min(100, parseInt(limit));

  const offset = (pageNum - 1) * limitNum;

  const { count, rows } = await model.findAndCountAll({
      where: query,
      limit: limitNum,
      offset: offset,
      include, // Add include here to include associations
  });

  return {
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
  };
};

module.exports = paginate;
