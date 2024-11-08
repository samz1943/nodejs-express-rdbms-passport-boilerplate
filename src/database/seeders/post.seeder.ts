import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../entities/User';
import { Post } from '../../entities/Post';
import { DataSource } from 'typeorm';

export default class PostSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepository =  dataSource.getRepository(User);
    const users = await userRepository.find();
    
    const postFactory = await factoryManager.get(Post);
    const numPosts = 50;

    for (let i = 0; i < numPosts; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      await postFactory.save({ user_id: randomUser.id });
    }
  }
}
