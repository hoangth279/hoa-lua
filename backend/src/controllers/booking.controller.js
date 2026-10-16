const db = require('../config/database');
const { asyncHandler, clean } = require('../utils/http');
const vnPhoneRegex = /^(?:\+84|0)[35789]\d{8}$/;
const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;

const createBooking = asyncHandler(async (req, res) => {
  const workshopId = Number(req.body.workshopId); const fullName = clean(req.body.fullName, 120); const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''; const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : ''; const note = clean(req.body.note, 1000); const participants = Number(req.body.participants || 1);
  const errors = {};
  if (!vnPhoneRegex.test(phone)) errors.phone = 'Vui lòng nhập số điện thoại Việt Nam hợp lệ, ví dụ 0912345678 hoặc +84912345678.';
  if (email.length > 190 || !emailRegex.test(email)) errors.email = 'Vui lòng nhập email hợp lệ, ví dụ ban@example.com (tối đa 190 ký tự).';
  if (Object.keys(errors).length || !Number.isInteger(workshopId) || !fullName || !Number.isInteger(participants) || participants < 1 || participants > 4) return res.status(422).json({ success: false, message: 'Thông tin đăng ký chưa hợp lệ.', errors });
  const connection = await db.getConnection();
  try { await connection.beginTransaction(); const [workshops] = await connection.execute('SELECT id, capacity FROM workshops WHERE id = ? AND is_published = 1 AND starts_at >= NOW() FOR UPDATE', [workshopId]); if (!workshops[0]) { await connection.rollback(); return res.status(404).json({ success: false, message: 'Workshop không tồn tại hoặc đã kết thúc.' }); } const [totals] = await connection.execute("SELECT COALESCE(SUM(participants), 0) AS reserved FROM bookings WHERE workshop_id = ? AND status IN ('pending','confirmed')", [workshopId]); if (Number(totals[0].reserved) + participants > workshops[0].capacity) { await connection.rollback(); return res.status(409).json({ success: false, message: 'Workshop không còn đủ chỗ cho số người đã chọn.' }); } const [result] = await connection.execute('INSERT INTO bookings (workshop_id, full_name, email, phone, participants, note, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [workshopId, fullName, email, phone, participants, note || null, 'pending']); await connection.commit(); res.status(201).json({ success: true, message: 'Đăng ký thành công. Họa Lụa sẽ sớm liên hệ xác nhận!', data: { id: result.insertId, status: 'pending' } }); }
  catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
});
module.exports = { createBooking };
