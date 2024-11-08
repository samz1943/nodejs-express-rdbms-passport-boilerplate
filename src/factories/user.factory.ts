import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

export const UserFactory = setSeederFactory(User, async (faker) => {
    const user = new User();
    user.username = faker.internet.userName();
    user.email = faker.internet.email();
    user.password = await bcrypt.hash("1234", 10);
    user.isVerified = faker.datatype.boolean();
    user.tokenExpiration = faker.date.future();

    return user;
})
