import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { call } from '../support/app';

// One file per API resource, named after its router, with its tests in one describe named the same.
describe('health', () => {
  test('reports the server and its database up', async () => {
    const reply = await call<{ status: string; db: string }>('GET', '/api/health');
    assert.equal(reply.status, 200);
    assert.deepEqual(reply.body, { status: 'ok', db: 'up' });
  });
});
