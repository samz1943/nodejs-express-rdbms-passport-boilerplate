import tokenStore from './testStore';
import app from '../src/index';
import request from 'supertest';
import { AppDataSource } from '../src/data-source';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  app.close();
  await AppDataSource.destroy();
});

describe('/Post login', () => {
  it('should log in and receive a token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@test.com', password: '1234' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    
    tokenStore.setUserToken(res.body.accessToken);
  });

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Incorrect password');
  });
});
