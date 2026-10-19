import { test } from 'node:test';
import assert from 'node:assert/strict';
import { askQuestion } from './assistant';

test('sends trimmed question and returns a validated answer', async () => {
  const fetcher = (async (url, init) => {
    assert.equal(url, '/api/soru-sor');
    assert.deepEqual(JSON.parse(init!.body as string), { soru: 'deprem' });
    assert.ok(init!.signal);
    return new Response(JSON.stringify({ cevap: 'document answer' }));
  }) as typeof fetch;
  assert.equal((await askQuestion(' deprem ', fetcher, '/api/')).cevap, 'document answer');
});

test('rejects HTTP failures before treating them as answers', async () => {
  const fetcher = (async () => new Response('{}', { status: 503 })) as typeof fetch;
  await assert.rejects(askQuestion('deprem', fetcher, '/api'), /503/);
});

test('rejects malformed and empty responses', async () => {
  for (const body of [{}, { cevap: 4 }, { cevap: '' }, null]) {
    await assert.rejects(askQuestion('deprem', (async () => new Response(JSON.stringify(body))) as typeof fetch, '/api'), /Invalid/);
  }
});

test('rejects blank and oversized questions without a network request', async () => {
  const fetcher = (() => { throw new Error('must not fetch'); }) as typeof fetch;
  await assert.rejects(askQuestion(' ', fetcher, '/api'), /1–1000/);
  await assert.rejects(askQuestion('x'.repeat(1001), fetcher, '/api'), /1–1000/);
});

test('propagates network failures', async () => {
  await assert.rejects(askQuestion('deprem', (async () => { throw new TypeError('offline'); }) as typeof fetch, '/api'), /offline/);
});
