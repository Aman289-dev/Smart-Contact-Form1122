import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { call, unique } from '../support/app';

describe('contact', () => {
  test('stores a valid message', async () => {
    const reply = await call('POST', '/api/contact', {
      name: 'Ada',
      email: `${unique('ada')}@example.com`,
      subject: 'Hello',
      message: 'I would like to know more.',
    });
    assert.equal(reply.status, 201);
    assert.equal(reply.body.success, true);
    assert.equal(typeof reply.body.id, 'string');
  });

  test('rejects missing fields and a bad email', async () => {
    const reply = await call('POST', '/api/contact', { name: ' ', email: 'not-an-email' });
    assert.equal(reply.status, 400);
    assert.deepEqual(Object.keys(reply.body.errors).sort(), ['email', 'message', 'name']);
  });

  test('rejects an over-long message', async () => {
    const reply = await call('POST', '/api/contact', {
      name: 'Ada',
      email: `${unique('ada')}@example.com`,
      message: 'x'.repeat(5001),
    });
    assert.equal(reply.status, 400);
    assert.ok(reply.body.errors.message);
  });

  test('offers no way to read messages back', async () => {
    const reply = await call('GET', '/api/contact');
    assert.equal(reply.status, 404);
  });
});
