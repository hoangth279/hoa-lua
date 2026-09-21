const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const routes = require('./routes');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((item) => item.trim());
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors({ credentials: true, origin(origin, callback) { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); const error = new Error('Origin không được phép.'); error.status = 403; return callback(error); } }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const requests = new Map();
const loginAttempts = new Map();
app.use('/api/admin/auth/login', (req, res, next) => {
    const now = Date.now(); const key = req.ip; const current = loginAttempts.get(key);
    if (!current || now > current.resetAt) loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60_000 });
    else { current.count += 1; if (current.count > 10) return res.status(429).json({ success: false, message: 'Có quá nhiều lần đăng nhập. Vui lòng thử lại sau 15 phút.' }); }
    next();
});
app.use('/api', (req, res, next) => {
    const now = Date.now(); const key = req.ip; const current = requests.get(key);
    if (!current || now > current.resetAt) requests.set(key, { count: 1, resetAt: now + 60_000 });
    else { current.count += 1; if (current.count > 100) return res.status(429).json({ success: false, message: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau một phút.' }); }
    next();
});

app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.resolve(__dirname, '../../frontend/dist');
    app.use(express.static(frontendDist, { index: false, maxAge: '7d' }));
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) return res.sendFile(path.join(frontendDist, 'index.html'));
        return next();
    });
}

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Not Found'
    });
});

app.use((error, req, res, _next) => {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, error.message);
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Slug hoặc email này đã tồn tại.' });
    if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ success: false, message: 'Không thể xóa vì dữ liệu đang được sử dụng.' });
    res.status(error.status || 500).json({ success: false, message: error.status ? error.message : 'Hệ thống đang bận. Vui lòng thử lại sau.' });
});

module.exports = app;
