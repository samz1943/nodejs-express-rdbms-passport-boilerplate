export const userResponse = (user: any) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
  };
};

export const postResponse = (post: any) => {
  return {
    id: post._id,
    title: post.title,
    content: post.content,
    publishedBy: userResponse(post.author),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
};

export const commentResponse = (comment: any) => {
  return {
    id: comment._id,
    content: comment.content,
    post_id: comment.post,
    commentBy: userResponse(comment.author),
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  };
};

interface Response<T> {
  status: number;
  data: T;
  message: string | null;
  errors: any | null;
}

export const responseFormatter = <T>(
  status: number,
  data: T,
  message: string | null = null,
  errors: any | null = null
): Response<T> => {
  const response: Response<T> = {
    status,
    data,
    message,
    errors,
  };

  return response;
};
