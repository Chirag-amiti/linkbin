import request from 'supertest';

import app from '../../src/app.js';

export const registerTestUser = async (overrides = {}) => {
  const payload = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
    ...overrides,
  };

  const response = await request(app).post('/api/auth/register').send(payload).expect(201);

  return {
    payload,
    token: response.body.data.token,
    user: response.body.data.user,
  };
};
