require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/config/database');

async function main() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email && !password) {
    console.log('Bỏ qua bootstrap admin: chưa cấu hình ADMIN_EMAIL/ADMIN_PASSWORD.');
    return;
  }
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
  console.log(`Admin bootstrap sẵn sàng: ${email} (${role}).`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => db.end());
