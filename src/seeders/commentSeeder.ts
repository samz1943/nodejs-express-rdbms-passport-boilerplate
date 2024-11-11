import { faker } from '@faker-js/faker';
import Comment from '../models/Comment';
import User from '../models/User';
import Post from '../models/Post';

export const commentSeeder = async () => {
  await Comment.deleteMany();

  const users = await User.find();
  const posts = await Post.find();
  const comments = [];

  for (let i = 0; i < 150; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    comments.push({
      content: faker.lorem.sentence(),
      author: randomUser._id,
      post: randomPost._id,
    });
  }

  await Comment.insertMany(comments);
};
