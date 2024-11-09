import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { User } from "../entities/User";

export const userResponse = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

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
