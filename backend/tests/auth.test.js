import request from 'supertest';

import app from '../src/app.js';
import { registerTestUser } from './helpers/auth.js';

describe('Auth API', () => {
  it('registers a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Chirag Raj',
        email: 'chirag@example.com',
        password: 'Password123',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.user.email).toBe('chirag@example.com');
    expect(response.body.data.user.passwordHash).toBeUndefined();
  });

  it('blocks duplicate email registration', async () => {
    await registerTestUser({ email: 'duplicate@example.com' });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate User',
        email: 'duplicate@example.com',
        password: 'Password123',
      })
      .expect(409);

    expect(response.body.message).toBe('Email already registered');
  });

  it('logs in with valid credentials', async () => {
    await registerTestUser({ email: 'login@example.com' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'Password123',
      })
      .expect(200);

    expect(response.body.data.token).toBeTruthy();
  });

  it('rejects invalid login credentials', async () => {
    await registerTestUser({ email: 'wrong@example.com' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'bad-password',
      })
      .expect(401);

    expect(response.body.message).toBe('Invalid email or password');
  });

  it('protects the current user route', async () => {
    const { token } = await registerTestUser({ email: 'me@example.com' });

    await request(app).get('/api/auth/me').expect(401);

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.user.email).toBe('me@example.com');
  });
});
