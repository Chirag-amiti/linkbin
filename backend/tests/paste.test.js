import request from 'supertest';

import app from '../src/app.js';
import { Paste } from '../src/models/Paste.js';
import { PasteAnalytics } from '../src/models/PasteAnalytics.js';
import { registerTestUser } from './helpers/auth.js';

describe('Paste API', () => {
  it('creates a paste', async () => {
    const { token } = await registerTestUser();

    const response = await request(app)
      .post('/api/pastes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JWT error log',
        content: 'Error: invalid token',
        language: 'text',
        visibility: 'unlisted',
      })
      .expect(201);

    expect(response.body.data.paste.title).toBe('JWT error log');
    expect(response.body.data.paste.slug).toBeTruthy();
    expect(response.body.data.pasteLink).toContain('/p/');
  });

  it('views public paste and records analytics', async () => {
    const { token } = await registerTestUser();

    await request(app)
      .post('/api/pastes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Public paste',
        slug: 'public-log',
        content: 'console.log("ok")',
        language: 'javascript',
        visibility: 'public',
      })
      .expect(201);

    const response = await request(app).get('/p/public-log').expect(200);

    expect(response.body.data.paste.content).toBe('console.log("ok")');

    const paste = await Paste.findOne({ slug: 'public-log' });
    const events = await PasteAnalytics.find({ paste: paste._id });

    expect(paste.totalViews).toBe(1);
    expect(paste.uniqueViews).toBe(1);
    expect(events).toHaveLength(1);
  });

  it('blocks private paste for anonymous users', async () => {
    const { token } = await registerTestUser();

    await request(app)
      .post('/api/pastes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Private paste',
        slug: 'private-log',
        content: 'secret',
        visibility: 'private',
      })
      .expect(201);

    const response = await request(app).get('/p/private-log').expect(403);

    expect(response.body.message).toBe('This paste is private');
  });

  it('allows private paste for owner', async () => {
    const { token } = await registerTestUser();

    await request(app)
      .post('/api/pastes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Owner paste',
        slug: 'owner-log',
        content: 'owner secret',
        visibility: 'private',
      })
      .expect(201);

    const response = await request(app)
      .get('/p/owner-log')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.paste.content).toBe('owner secret');
  });

  it('does not show expired pastes', async () => {
    const { token } = await registerTestUser();

    await request(app)
      .post('/api/pastes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Expired paste',
        slug: 'expired-paste',
        content: 'old content',
        visibility: 'public',
      })
      .expect(201);

    await Paste.updateOne({ slug: 'expired-paste' }, { $set: { expiresAt: new Date(Date.now() - 1000) } });

    const response = await request(app).get('/p/expired-paste').expect(410);

    expect(response.body.message).toBe('Paste has expired');
  });
});
