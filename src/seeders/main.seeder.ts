import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import UserSeeder from './user.seeder';
import PostSeeder from './post.seeder';
import CommentSeeder from './comment.seeder';

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    await new UserSeeder().run(dataSource, factoryManager);
    await new PostSeeder().run(dataSource, factoryManager);
    await new CommentSeeder().run(dataSource, factoryManager);
  }
}
