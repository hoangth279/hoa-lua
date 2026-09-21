const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { asyncHandler, clean, isEmail } = require('../utils/http');
const { COOKIE_NAME } = require('../middleware/auth');
const { getJwtSecret } = require('../config/auth');

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/admin',
  maxAge: 8 * 60 * 60 * 1000
});

const login = asyncHandler(async (req, res) => {
  const email = clean(req.body.email, 190).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const jwtSecret = getJwtSecret();
  if (!jwtSecret || jwtSecret.length < 32) return res.status(503).json({ success: false, message: 'Chức năng đăng nhập chưa được cấu hình.' });
  if (!isEmail(email) || password.length < 6) return res.status(422).json({ success: false, message: 'Email hoặc mật khẩu không hợp lệ.' });
  const [rows] = await db.execute('SELECT id, full_name, email, password_hash, role, status FROM admin_users WHERE email = ? LIMIT 1', [email]);
  const user = rows[0];
  if (!user || user.status !== 'active' || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
  const token = jwt.sign({ sub: user.id, email: user.email, name: user.full_name, role: user.role }, jwtSecret, { expiresIn: '8h', issuer: 'hoa-lua-api', audience: 'hoa-lua-admin' });
  await db.execute('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?', [user.id]);
  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.json({ success: true, data: { id: user.id, name: user.full_name, email: user.email, role: user.role } });
});

const me = asyncHandler(async (req, res) => {
  const [rows] = await db.execute("SELECT id, full_name AS name, email, role FROM admin_users WHERE id = ? AND status = 'active' LIMIT 1", [req.admin.sub]);
  if (!rows[0]) return res.status(401).json({ success: false, message: 'Tài khoản không còn hoạt động.' });
  res.json({ success: true, data: rows[0] });
});

const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
  res.json({ success: true, message: 'Đã đăng xuất.' });
};

module.exports = { login, me, logout };
