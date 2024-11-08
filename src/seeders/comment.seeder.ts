import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';
import { DataSource } from 'typeorm';

export default class CommentSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepository =  dataSource.getRepository(User);
    const users = await userRepository.find();

    const postRepository =  dataSource.getRepository(Post);
    const post = await postRepository.find();
    const numComments = 50;

    for (let i = 0; i < numComments; i++) {
      const commentFactory = await factoryManager.get(Comment);
      await commentFactory.save({
        user_id: users[Math.floor(Math.random() * users.length)].id,
        post_id: post[Math.floor(Math.random() * post.length)].id,
      });
    }
  }
}
