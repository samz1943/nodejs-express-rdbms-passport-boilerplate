// Define types for the user, post, and comment objects
interface User {
  id: number;
  username: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  id: number;
  content: string;
  post_id: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

// User response formatter
export const userResponse = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

// Post response formatter
export const postResponse = (post: Post) => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    publishedBy: userResponse(post.user),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
};

// Comment response formatter
export const commentResponse = (comment: Comment) => {
  return {
    id: comment.id,
    content: comment.content,
    post_id: comment.post_id,
    commentBy: userResponse(comment.user),
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  };
};

// Response formatter with optional data, message, and errors
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
