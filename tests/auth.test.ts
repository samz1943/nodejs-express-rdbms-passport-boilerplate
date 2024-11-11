import tokenStore from './testStore';
import app from '../src/index';
import { mongoose } from '../src/config/database';
import request from 'supertest';

afterAll(async () => {
  await mongoose.connection.close();
  app.close();
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
