const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/auth');

const COOKIE_NAME = 'hoa_lua_admin';

function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục.' });
  try {
    req.admin = jwt.verify(token, getJwtSecret(), { issuer: 'hoa-lua-api', audience: 'hoa-lua-admin' });
    return next();
  } catch (_error) {
    res.clearCookie(COOKIE_NAME, { path: '/api/admin' });
    return res.status(401).json({ success: false, message: 'Phiên đăng nhập đã hết hạn.' });
  }
}

function requireSuperAdmin(req, res, next) {
  if (req.admin?.role !== 'super_admin') return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện thao tác này.' });
  return next();
}

module.exports = { COOKIE_NAME, requireAdmin, requireSuperAdmin };
