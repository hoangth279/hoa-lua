const db = require('../config/database');

async function writeAudit(req, action, entityType, entityId = null, payload = null) {
  try {
    await db.execute(
      'INSERT INTO audit_logs (admin_user_id, action, entity_type, entity_id, payload, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [req.admin?.sub || null, action, entityType, entityId, payload ? JSON.stringify(payload) : null, req.ip]
    );
  } catch (error) {
    console.error('Không thể ghi audit log:', error.message);
  }
}

module.exports = { writeAudit };
