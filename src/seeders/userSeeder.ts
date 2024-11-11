import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import User from '../models/User';

export const userSeeder = async () => {
  await User.deleteMany();

  const users = [
    {
      username: 'Test',
      email: 'test@test.com',
      password: await bcrypt.hash('1234', 10),
      isVerified: true,
    },
  ];

  for (let i = 0; i < 10; i++) {
    users.push({
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: await bcrypt.hash('1234', 10),
      isVerified: faker.datatype.boolean(),
    });
  }

  await User.insertMany(users);
};
