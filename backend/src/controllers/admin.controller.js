const db = require('../config/database');
const { asyncHandler, clean } = require('../utils/http');
const { writeAudit } = require('../services/audit.service');

const allowedStatuses = {
  booking: ['pending', 'confirmed', 'cancelled', 'attended'],
  contact: ['new', 'in_progress', 'resolved', 'spam']
};

const dashboard = asyncHandler(async (_req, res) => {
  const [[bookingCount], [contactCount], [workshopCount], [postCount], [recentBookings], [recentContacts]] = await Promise.all([
    db.query("SELECT COUNT(*) total, SUM(status = 'pending') pending FROM bookings"),
    db.query("SELECT COUNT(*) total, SUM(status = 'new') pending FROM contact_messages"),
    db.query("SELECT COUNT(*) total, SUM(is_published = 1 AND starts_at >= NOW()) upcoming FROM workshops"),
    db.query("SELECT COUNT(*) total, SUM(is_published = 1) published FROM posts"),
    db.query('SELECT b.id, b.full_name AS fullName, b.participants, b.status, b.created_at AS createdAt, w.title AS workshopTitle FROM bookings b JOIN workshops w ON w.id = b.workshop_id ORDER BY b.created_at DESC LIMIT 6'),
    db.query('SELECT id, full_name AS fullName, subject, status, created_at AS createdAt FROM contact_messages ORDER BY created_at DESC LIMIT 6')
  ]);
  res.json({ success: true, data: { stats: { bookings: bookingCount[0], contacts: contactCount[0], workshops: workshopCount[0], posts: postCount[0] }, recentBookings, recentContacts } });
});

const listBookings = asyncHandler(async (req, res) => {
  const status = clean(req.query.status, 30); const search = clean(req.query.search, 100); const params = []; let where = 'WHERE 1=1';
  if (status && allowedStatuses.booking.includes(status)) { where += ' AND b.status = ?'; params.push(status); }
  if (search) { where += ' AND (b.full_name LIKE ? OR b.email LIKE ? OR b.phone LIKE ?)'; const value = `%${search}%`; params.push(value, value, value); }
  const [rows] = await db.execute(`SELECT b.id, b.full_name AS fullName, b.email, b.phone, b.participants, b.note, b.status, b.created_at AS createdAt, w.id AS workshopId, w.title AS workshopTitle, w.starts_at AS startsAt FROM bookings b JOIN workshops w ON w.id = b.workshop_id ${where} ORDER BY b.created_at DESC LIMIT 300`, params);
  res.json({ success: true, data: rows });
});

const updateBooking = asyncHandler(async (req, res) => {
  const status = clean(req.body.status, 30); if (!allowedStatuses.booking.includes(status)) return res.status(422).json({ success: false, message: 'Trạng thái booking không hợp lệ.' });
  const [result] = await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]); if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Không tìm thấy booking.' });
  await writeAudit(req, 'update_status', 'booking', Number(req.params.id), { status }); res.json({ success: true, message: 'Đã cập nhật booking.' });
});

const listContacts = asyncHandler(async (req, res) => {
  const status = clean(req.query.status, 30); const params = []; let where = 'WHERE 1=1'; if (status && allowedStatuses.contact.includes(status)) { where += ' AND status = ?'; params.push(status); }
  const [rows] = await db.execute(`SELECT id, full_name AS fullName, email, subject, message, status, created_at AS createdAt FROM contact_messages ${where} ORDER BY created_at DESC LIMIT 300`, params); res.json({ success: true, data: rows });
});

const updateContact = asyncHandler(async (req, res) => {
  const status = clean(req.body.status, 30); if (!allowedStatuses.contact.includes(status)) return res.status(422).json({ success: false, message: 'Trạng thái liên hệ không hợp lệ.' });
  const [result] = await db.execute('UPDATE contact_messages SET status = ? WHERE id = ?', [status, req.params.id]); if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Không tìm thấy liên hệ.' });
  await writeAudit(req, 'update_status', 'contact', Number(req.params.id), { status }); res.json({ success: true, message: 'Đã cập nhật liên hệ.' });
});

const resources = {
  campaigns: { table: 'campaigns', fields: ['slug','title','excerpt','content','status','start_date','end_date','cover_image','display_order','is_published'], required: ['slug','title','excerpt'] },
  workshops: { table: 'workshops', fields: ['slug','title','excerpt','description','location','starts_at','ends_at','capacity','price','cover_image','is_published'], required: ['slug','title','excerpt','location','starts_at','ends_at','capacity'] },
  posts: { table: 'posts', fields: ['slug','title','excerpt','content','category','cover_image','is_published','published_at'], required: ['slug','title','excerpt','content','category'] },
  gallery: { table: 'gallery_items', fields: ['title','description','media_type','media_url','thumbnail_url','display_order','is_published'], required: ['title','media_type','media_url'] }
};

const normalizeValue = (field, value) => {
  if (['display_order','capacity'].includes(field)) return Number(value || 0);
  if (field === 'price') return Number(value || 0);
  if (field === 'is_published') return value ? 1 : 0;
  if (['starts_at','ends_at','published_at'].includes(field) && value) return String(value).replace('T', ' ') + (String(value).length === 16 ? ':00' : '');
  return value === '' || value === undefined ? null : (typeof value === 'string' ? value.trim() : value);
};

const listResource = asyncHandler(async (req, res) => {
  const config = resources[req.params.resource]; if (!config) return res.status(404).json({ success: false, message: 'Nhóm dữ liệu không tồn tại.' });
  const [rows] = await db.query(`SELECT * FROM ${config.table} ORDER BY updated_at DESC LIMIT 300`); res.json({ success: true, data: rows });
});

const createResource = asyncHandler(async (req, res) => {
  const config = resources[req.params.resource]; if (!config) return res.status(404).json({ success: false, message: 'Nhóm dữ liệu không tồn tại.' });
  for (const field of config.required) if (req.body[field] === undefined || req.body[field] === '') return res.status(422).json({ success: false, message: `Thiếu trường bắt buộc: ${field}.` });
  const fields = config.fields.filter((field) => req.body[field] !== undefined); const values = fields.map((field) => normalizeValue(field, req.body[field]));
  const [result] = await db.execute(`INSERT INTO ${config.table} (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`, values);
  await writeAudit(req, 'create', req.params.resource, result.insertId); res.status(201).json({ success: true, message: 'Đã tạo nội dung.', data: { id: result.insertId } });
});

const updateResource = asyncHandler(async (req, res) => {
  const config = resources[req.params.resource]; if (!config) return res.status(404).json({ success: false, message: 'Nhóm dữ liệu không tồn tại.' });
  const fields = config.fields.filter((field) => req.body[field] !== undefined); if (!fields.length) return res.status(422).json({ success: false, message: 'Không có dữ liệu cần cập nhật.' });
  const values = fields.map((field) => normalizeValue(field, req.body[field])); values.push(req.params.id);
  const [result] = await db.execute(`UPDATE ${config.table} SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id = ?`, values); if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Không tìm thấy nội dung.' });
  await writeAudit(req, 'update', req.params.resource, Number(req.params.id), { fields }); res.json({ success: true, message: 'Đã lưu thay đổi.' });
});

const deleteResource = asyncHandler(async (req, res) => {
  const config = resources[req.params.resource]; if (!config) return res.status(404).json({ success: false, message: 'Nhóm dữ liệu không tồn tại.' });
  const [result] = await db.execute(`DELETE FROM ${config.table} WHERE id = ?`, [req.params.id]); if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Không tìm thấy nội dung.' });
  await writeAudit(req, 'delete', req.params.resource, Number(req.params.id)); res.json({ success: true, message: 'Đã xóa nội dung.' });
});

const getSettings = asyncHandler(async (_req, res) => { const [rows] = await db.query('SELECT setting_key AS settingKey, setting_value AS settingValue, setting_group AS settingGroup FROM site_settings ORDER BY setting_group, setting_key'); res.json({ success: true, data: rows }); });
const updateSettings = asyncHandler(async (req, res) => { const entries = Object.entries(req.body.settings || {}).slice(0, 50); if (!entries.length) return res.status(422).json({ success: false, message: 'Không có cấu hình cần lưu.' }); const statements = entries.map(([key,value]) => db.execute('INSERT INTO site_settings (setting_key, setting_value, updated_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)', [clean(key,120), clean(value,2000), req.admin.sub])); await Promise.all(statements); await writeAudit(req, 'update', 'settings', null, { keys: entries.map(([key]) => key) }); res.json({ success: true, message: 'Đã lưu cấu hình website.' }); });

module.exports = { dashboard, listBookings, updateBooking, listContacts, updateContact, listResource, createResource, updateResource, deleteResource, getSettings, updateSettings };
