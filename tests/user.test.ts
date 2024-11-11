import tokenStore from './testStore';
import app from '../src/index';
import { mongoose } from '../src/config/database';
import request from 'supertest';

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

describe('/GET User', () => {
  it('it should get all the users', async () => {
    const token = tokenStore.getUserToken();
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    res.body.data.forEach((user: any) => {
      expect(user).toHaveProperty('id');
      expect(typeof user.id).toBe('string');
      expect(user).toHaveProperty('username');
      expect(typeof user.username).toBe('string');
      expect(user).toHaveProperty('email');
      expect(typeof user.email).toBe('string');
    });
  });
});
