const db = require('../config/database');
const healthCheck = async (req, res) => {
    let database = 'disconnected';
    try { await db.query('SELECT 1'); database = 'connected'; } catch (_error) { /* Report status without leaking credentials. */ }
    res.json({
        success: true,
        message: 'Họa Lụa API đang hoạt động',
        database,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    healthCheck
};
