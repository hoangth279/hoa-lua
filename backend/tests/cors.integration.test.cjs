const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test, before, after } = require('node:test');

// Build the frontend first: these tests exercise real production static serving.
const previousEnv = { NODE_ENV: process.env.NODE_ENV, FRONTEND_URL: process.env.FRONTEND_URL };
process.env.NODE_ENV = 'production';
process.env.FRONTEND_URL = 'https://hoalua.online,https://www.hoalua.online';
const app = require('../src/app');
let server, baseUrl;

before(async () => {
    server = await new Promise((resolve) => {
        const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    for (const [key, value] of Object.entries(previousEnv)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }
});

const headers = (origin) => ({ 'X-Forwarded-Proto': 'https', ...(origin ? { Origin: origin } : {}) });

test('public HTML, CSS and JS are served even with an unlisted origin', async () => {
    const html = readFileSync(path.resolve(__dirname, '../../frontend/dist/index.html'), 'utf8');
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+\.(?:js|css))"/g)].map((match) => match[1]);
    assert.ok(assets.some((asset) => asset.endsWith('.js')));
    assert.ok(assets.some((asset) => asset.endsWith('.css')));
    for (const url of ['/', ...assets]) {
        const response = await fetch(`${baseUrl}${url}`, { headers: headers('https://preview.example') });
        assert.equal(response.status, 200, url);
        assert.ok((await response.text()).length > 0);
        assert.equal(response.headers.get('access-control-allow-credentials'), null);
    }
});

test('both configured production origins pass credentialed API preflight', async () => {
    for (const origin of ['https://hoalua.online', 'https://www.hoalua.online']) {
        const response = await fetch(`${baseUrl}/api/bookings`, {
            method: 'OPTIONS', headers: { ...headers(origin), 'Access-Control-Request-Method': 'POST' },
        });
        assert.equal(response.status, 204);
        assert.equal(response.headers.get('access-control-allow-origin'), origin);
        assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
    }
});

test('unlisted API origin stays blocked and is included in the server log', async (t) => {
    const log = t.mock.method(console, 'error', () => {});
    const response = await fetch(`${baseUrl}/api/not-a-route`, { headers: headers('https://preview.example') });
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { success: false, message: 'Origin không được phép.' });
    assert.ok(log.mock.calls.some((call) => call.arguments.includes(JSON.stringify({ origin: 'https://preview.example' }))));
});

test('API requests without Origin continue to reach the router', async () => {
    const response = await fetch(`${baseUrl}/api/not-a-route`, { headers: headers() });
    assert.equal(response.status, 404);
});
