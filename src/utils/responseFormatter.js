const userResponse = (user) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
};

const responseFormatter = (status, data = null, message = null, errors = null) => {
    const response = {
        status,
        data,
        message,
        errors,
    };

    return response;
};

module.exports = { userResponse, responseFormatter};
  