import request from 'supertest';

import app from '../src/app.js';
import { ShortUrl } from '../src/models/ShortUrl.js';
import { UrlAnalytics } from '../src/models/UrlAnalytics.js';
import { registerTestUser } from './helpers/auth.js';

describe('URL Shortener API', () => {
  it('creates a short URL', async () => {
    const { token } = await registerTestUser();

    const response = await request(app)
      .post('/api/urls')
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'https://example.com/products/shoes',
        title: 'Shoe campaign',
      })
      .expect(201);

    expect(response.body.data.shortUrl.originalUrl).toBe('https://example.com/products/shoes');
    expect(response.body.data.shortUrl.shortCode).toBeTruthy();
    expect(response.body.data.shortLink).toContain(response.body.data.shortUrl.shortCode);
  });

  it('creates a custom alias and blocks duplicates', async () => {
    const { token } = await registerTestUser();

    await request(app)
      .post('/api/urls')
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'https://example.com/one',
        customAlias: 'my-link',
      })
      .expect(201);

    const response = await request(app)
      .post('/api/urls')
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'https://example.com/two',
        customAlias: 'my-link',
      })
      .expect(409);

    expect(response.body.message).toBe('Short code or alias already exists');
  });

  it('blocks reserved aliases', async () => {
    const { token } = await registerTestUser();

    const response = await request(app)
      .post('/api/urls')
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'https://example.com',
        customAlias: 'api',
      })
      .expect(400);

    expect(response.body.message).toBe('This alias is reserved');
  });

  it('redirects to original URL and records analytics', async () => {
    const { token } = await registerTestUser();

    await request(app)
      .post('/api/urls')
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'https://example.com/redirect-target',
        customAlias: 'go-now',
      })
      .expect(201);

    const response = await request(app).get('/go-now').redirects(0).expect(302);

    expect(response.headers.location).toBe('https://example.com/redirect-target');

    const shortUrl = await ShortUrl.findOne({ shortCode: 'go-now' });
    const events = await UrlAnalytics.find({ shortUrl: shortUrl._id });

    expect(shortUrl.totalClicks).toBe(1);
    expect(shortUrl.uniqueClicks).toBe(1);
    expect(events).toHaveLength(1);
  });

  it('does not redirect expired URLs', async () => {
    const { token } = await registerTestUser();

    await request(app)
      .post('/api/urls')
      .set('Authorization', `Bearer ${token}`)
      .send({
        originalUrl: 'https://example.com/expired',
        customAlias: 'old-link',
      })
      .expect(201);

    await ShortUrl.updateOne({ shortCode: 'old-link' }, { $set: { expiresAt: new Date(Date.now() - 1000) } });

    const response = await request(app).get('/old-link').redirects(0).expect(302);

    expect(response.headers.location).toBe('http://localhost:5173/expired?type=url');
  });
});
