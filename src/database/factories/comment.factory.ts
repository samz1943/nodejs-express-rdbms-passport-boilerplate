
import { setSeederFactory } from 'typeorm-extension';
import { Comment } from '../../entities/Comment';

export const CommentFactory = setSeederFactory(Comment, (faker) => {
    const comment = new Comment();
    comment.content = faker.lorem.sentence();

    return comment;
});
