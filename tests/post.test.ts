import tokenStore from './testStore';
import app from '../src/index';
import { mongoose } from '../src/config/database';
import request from 'supertest';
import Post from '../src/models/Post';

beforeAll(async () => {
  const token = tokenStore.getUserToken();
  if (!token) {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@test.com', password: '1234' });

    tokenStore.setUserToken(res.body.accessToken);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  app.close();
});

describe('/GET Post', () => {
  it('it should get all the posts', async () => {
    const token = tokenStore.getUserToken();
    const res = await request(app)
      .get('/api/post')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    res.body.data.forEach((post: any) => {
      expect(post).toHaveProperty('id');
      expect(typeof post.id).toBe('string');
      expect(post).toHaveProperty('title');
      expect(typeof post.title).toBe('string');
      expect(post).toHaveProperty('content');
      expect(typeof post.content).toBe('string');

      // Check `publishedBy` object structure
      expect(post).toHaveProperty('publishedBy');
      expect(typeof post.publishedBy).toBe('object');
      expect(post.publishedBy).toHaveProperty('id');
      expect(typeof post.publishedBy.id).toBe('string');
      expect(post.publishedBy).toHaveProperty('username');
      expect(typeof post.publishedBy.username).toBe('string');
      expect(post.publishedBy).toHaveProperty('email');
      expect(typeof post.publishedBy.email).toBe('string');

      // Check date fields
      expect(post).toHaveProperty('createdAt');
      expect(typeof post.createdAt).toBe('string');
      expect(post).toHaveProperty('updatedAt');
      expect(typeof post.updatedAt).toBe('string');
    });
  });
});

describe('/POST Post', () => {
  it('it should create a post and confirm its presence in the database', async () => {
    const token = tokenStore.getUserToken();
    
    const postData = { title: 'test create', content: 'test create post successful' };

    const res = await request(app)
      .post('/api/post')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Post created successfully');

    const post = await Post.findOne({ title: postData.title, content: postData.content });

    expect(post).not.toBeNull();
    expect(post).toHaveProperty('title', postData.title);
    expect(post).toHaveProperty('content', postData.content);

    await Post.deleteOne({ _id: post?._id });
  });
});
