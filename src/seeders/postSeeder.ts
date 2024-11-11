import { faker } from '@faker-js/faker';
import Post from '../models/Post';
import User from '../models/User';

export const postSeeder = async () => {
  await Post.deleteMany();

  const users = await User.find();
  const posts = [];

  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    posts.push({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      author: randomUser._id,
    });
  }

  await Post.insertMany(posts);
};
