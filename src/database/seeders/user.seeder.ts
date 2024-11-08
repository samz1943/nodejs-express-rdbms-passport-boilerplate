import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../entities/User';
import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const repository =  dataSource.getRepository(User);
    await repository.insert([
        {
            username: 'Test',
            email: 'test@test.com',
            password: await bcrypt.hash("1234", 10),
            isVerified: true,
        }
    ]);
    
    const userFactory = await factoryManager.get(User);
    await userFactory.saveMany(10);
  }
}
