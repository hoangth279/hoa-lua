require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/config/database');

async function main() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const fullName = (process.env.ADMIN_NAME || 'Quản trị viên').trim();
  const role = process.env.ADMIN_ROLE === 'editor' ? 'editor' : 'super_admin';
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Cần đặt ADMIN_EMAIL hợp lệ.');
  if (password.length < 6) throw new Error('ADMIN_PASSWORD phải có ít nhất 6 ký tự.');
  const passwordHash = await bcrypt.hash(password, 12);
  await db.execute(
    `INSERT INTO admin_users (full_name, email, password_hash, role, status)
     VALUES (?, ?, ?, ?, 'active')
     ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash), role = VALUES(role), status = 'active'`,
    [fullName, email, passwordHash, role]
  );
  console.log(`Đã tạo/cập nhật tài khoản ${email} (${role}).`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => db.end());
