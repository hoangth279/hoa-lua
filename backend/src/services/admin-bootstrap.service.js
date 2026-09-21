const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function ensureAdminFromEnv() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email && !password) return { skipped: true };
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) throw new Error('ADMIN_EMAIL hoặc ADMIN_PASSWORD bootstrap không hợp lệ.');
  const fullName = (process.env.ADMIN_NAME || 'Quản trị viên').trim();
  const role = process.env.ADMIN_ROLE === 'editor' ? 'editor' : 'super_admin';
  const passwordHash = await bcrypt.hash(password, 12);
  await db.execute(
    `INSERT INTO admin_users (full_name, email, password_hash, role, status)
     VALUES (?, ?, ?, ?, 'active')
     ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), role = VALUES(role), status = 'active'`,
    [fullName, email, passwordHash, role]
  );
  return { skipped: false, email, role };
}

module.exports = { ensureAdminFromEnv };
