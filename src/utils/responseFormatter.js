const userResponse = (user) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
};

const postResponse = (post) => {
    return {
        id: post.id,
        title: post.title,
        content: post.content,
        publishedBy: userResponse(post.user),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
    };
};

const commentResponse = (comment) => {
    return {
        id: comment.id,
        content: comment.content,
        post: postResponse(comment.post),
        commentBy: userResponse(comment.user),
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
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

module.exports = { userResponse, postResponse, commentResponse, responseFormatter};
  