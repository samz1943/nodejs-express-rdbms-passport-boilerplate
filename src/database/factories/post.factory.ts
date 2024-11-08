
import { setSeederFactory } from 'typeorm-extension';
import { Post } from '../../entities/Post';

export const PostFactory = setSeederFactory(Post, (faker) => {
    const post = new Post();
    post.title = faker.lorem.sentence();
    post.content = faker.lorem.paragraph();

    return post;
});
