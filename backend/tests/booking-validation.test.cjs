const assert = require('node:assert/strict');
const { test, before } = require('node:test');

// Run the real controller against a stub database; never create real bookings.
const databasePath = require.resolve('../src/config/database');
let connectionCount = 0;
let insertedValues;
require.cache[databasePath] = {
  id: databasePath, filename: databasePath, loaded: true,
  exports: {
    async getConnection() {
      connectionCount += 1;
      return {
        async beginTransaction() {},
        async execute(sql, values) {
          if (sql.startsWith('SELECT id')) return [[{ id: 1, capacity: 30 }]];
          if (sql.startsWith('SELECT COALESCE')) return [[{ reserved: 0 }]];
          insertedValues = values;
          return [{ insertId: 42 }];
        },
        async commit() {}, async rollback() {}, release() {},
      };
    },
  },
};
const { createBooking } = require('../src/controllers/booking.controller');
let validateBookingContact;
before(async () => {
  ({ validateBookingContact } = await import('../../frontend/src/utils/bookingValidation.js'));
});

async function submit(overrides = {}) {
  const response = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
  await createBooking({ body: {
    workshopId: 1, fullName: 'Nguyen Van A', phone: '0912345678',
    email: 'ban@example.com', participants: 1, ...overrides,
  } }, response, (error) => { throw error; });
  return response;
}

test('frontend and backend accept all specified Vietnamese phone prefixes', async () => {
  for (const prefix of ['03', '05', '07', '08', '09', '+843', '+845', '+847', '+848', '+849']) {
    const phone = `${prefix}12345678`;
    assert.deepEqual(validateBookingContact({ phone, email: 'ban@example.com' }), {}, phone);
    assert.equal((await submit({ phone })).statusCode, 201, phone);
  }
});

test('both layers reject invalid phones, and backend never opens the database', async () => {
  for (const phone of ['', '0123456789', '0212345678', '0612345678', '091234567',
    '09123456789', '84912345678', '+840912345678', '+84112345678',
    '+1 912345678', '091 234 5678', '091-234-5678', '0912.345.678', 'abcdefghij']) {
    assert.ok(validateBookingContact({ phone, email: 'ban@example.com' }).phone, phone);
    const beforeCount = connectionCount;
    const res = await submit({ phone });
    assert.equal(res.statusCode, 422, phone);
    assert.ok(res.body.errors.phone, phone);
    assert.equal(connectionCount, beforeCount);
  }
});

test('both layers accept normal email, plus tags, subdomains and 190-character limit', async () => {
  for (const email of ['ban@example.com', 'ban.ten+workshop@sub.example.com',
    'BAN@EXAMPLE.COM', `${'a'.repeat(178)}@example.com`]) {
    assert.deepEqual(validateBookingContact({ phone: '0912345678', email }), {}, email);
    assert.equal((await submit({ email })).statusCode, 201, email);
  }
});

test('both layers reject malformed or overlong email before database access', async () => {
  for (const email of ['', 'ban', 'ban@', '@example.com', 'ban@example', 'ban@@example.com',
    'ban ten@example.com', 'ban@exam ple.com', 'ban@example..com', '.ban@example.com',
    'ban..ten@example.com', 'ban.@example.com', 'ban@-example.com', 'ban@example-.com',
    `${'a'.repeat(179)}@example.com`]) {
    assert.ok(validateBookingContact({ phone: '0912345678', email }).email, email);
    const beforeCount = connectionCount;
    const res = await submit({ email });
    assert.equal(res.statusCode, 422, email);
    assert.ok(res.body.errors.email, email);
    assert.equal(connectionCount, beforeCount);
  }
});

test('backend rejects missing and non-string contacts with both field errors', async () => {
  for (const value of [undefined, null, 912345678, {}, []]) {
    const beforeCount = connectionCount;
    const res = await submit({ phone: value, email: value });
    assert.equal(res.statusCode, 422);
    assert.deepEqual(Object.keys(res.body.errors).sort(), ['email', 'phone']);
    assert.equal(connectionCount, beforeCount);
  }
});

test('valid contacts are trimmed and email is stored in lowercase', async () => {
  const contact = { phone: '  +84912345678  ', email: '  Ban.Ten+kit@Example.COM  ' };
  assert.deepEqual(validateBookingContact(contact), {});
  assert.equal((await submit(contact)).statusCode, 201);
  assert.equal(insertedValues[2], 'ban.ten+kit@example.com');
  assert.equal(insertedValues[3], '+84912345678');
});
