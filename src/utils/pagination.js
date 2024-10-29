const paginate = async (model, query, page = 1, limit = 10) => {
    const pageNum = Math.max(0, parseInt(page)); // Ensure page number is positive
    const limitNum = Math.min(100, parseInt(limit)); // Set a maximum limit
  
    const offset = (pageNum - 1) * limitNum;
  
    // Fetch data and total count
    const { count, rows } = await model.findAndCountAll({
      where: query,
      limit: limitNum,
      offset: offset,
    });
  
    return {
        items: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limitNum),
        currentPage: pageNum,
    };
  };
  
  module.exports = paginate;
  