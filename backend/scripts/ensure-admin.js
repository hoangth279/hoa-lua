require('dotenv').config();
const db = require('../src/config/database');
const { ensureAdminFromEnv } = require('../src/services/admin-bootstrap.service');

ensureAdminFromEnv()
  .then((result) => console.log(result.skipped ? 'Bỏ qua bootstrap admin: chưa cấu hình ADMIN_EMAIL/ADMIN_PASSWORD.' : `Admin bootstrap sẵn sàng: ${result.email} (${result.role}).`))
  .catch((error) => { console.error(error.message); process.exitCode = 1; })
  .finally(() => db.end());
