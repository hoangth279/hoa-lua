const db = require('../config/database');
const { asyncHandler } = require('../utils/http');
const { writeAudit } = require('../services/audit.service');
const { STORY_SLUGS, parseStoryPost } = require('../services/story.service');

const selectStory = 'SELECT id, slug, title, content, is_published FROM posts WHERE slug IN (?, ?, ?)';
const orderStory = ' ORDER BY FIELD(slug, ?, ?, ?)';

const getStory = asyncHandler(async (_req, res) => {
  const [rows] = await db.execute(`${selectStory} AND is_published = 1${orderStory}`, [...STORY_SLUGS, ...STORY_SLUGS]);
  res.json({ success: true, data: rows.map(parseStoryPost) });
});

const getAdminStory = asyncHandler(async (_req, res) => {
  const [rows] = await db.execute(`${selectStory}${orderStory}`, [...STORY_SLUGS, ...STORY_SLUGS]);
  res.json({ success: true, data: rows.map(parseStoryPost) });
});

const saveStory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!STORY_SLUGS.includes(slug)) return res.status(404).json({ success: false, message: 'Mục Câu chuyện không tồn tại.' });
  const { title, content, isPublished } = req.body || {};
  if (typeof title !== 'string' || !title.trim() || title.length > 255) return res.status(422).json({ success: false, message: 'Vui lòng nhập tiêu đề mục (tối đa 255 ký tự).' });
  if (typeof content !== 'string' || !content.trim() || content.length > 50000) return res.status(422).json({ success: false, message: 'Vui lòng nhập nội dung mục (tối đa 50000 ký tự).' });
  if (typeof isPublished !== 'boolean') return res.status(422).json({ success: false, message: 'Trạng thái xuất bản không hợp lệ.' });
  const text = content.replace(/\r\n/g, '\n').trim();
  await db.execute(`INSERT INTO posts (slug, title, excerpt, content, category, is_published, published_at)
    VALUES (?, ?, ?, ?, ?, ?, IF(? = 1, NOW(), NULL))
    ON DUPLICATE KEY UPDATE title = VALUES(title), excerpt = VALUES(excerpt), content = VALUES(content),
      category = VALUES(category), is_published = VALUES(is_published),
      published_at = IF(VALUES(is_published) = 1, COALESCE(published_at, NOW()), published_at)`,
  [slug, title.trim(), text.split(/\n\s*\n/)[0].slice(0, 300), text, 'Câu chuyện', isPublished ? 1 : 0, isPublished ? 1 : 0]);
  const [rows] = await db.execute('SELECT id, slug, title, content, is_published FROM posts WHERE slug = ? LIMIT 1', [slug]);
  await writeAudit(req, 'update', 'posts', rows[0].id, { slug });
  res.json({ success: true, message: 'Đã lưu mục Câu chuyện.', data: parseStoryPost(rows[0]) });
});

module.exports = { getStory, getAdminStory, saveStory };