const assert = require('node:assert/strict');
const { describe, test, before, after, beforeEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

// Opt in with RUN_DB_TESTS=1. MySQL TEMPORARY tables shadow the real tables only
// on this dedicated connection; no existing records or audit logs are modified.
describe('admin content → MySQL → public API', { skip: process.env.RUN_DB_TESTS !== '1' }, () => {
  let pool, connection, admin, content, story;
  before(async () => {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });
    const databasePath = require.resolve('../src/config/database');
    pool = require(databasePath);
    connection = await pool.getConnection();
    for (const table of ['campaigns', 'posts']) {
      const [schema] = await connection.query(`SHOW CREATE TABLE ${table}`);
      await connection.query(schema[0]['Create Table'].replace('CREATE TABLE', 'CREATE TEMPORARY TABLE'));
    }
    require.cache[databasePath].exports = {
      query: connection.query.bind(connection), execute: connection.execute.bind(connection),
    };
    const auditPath = require.resolve('../src/services/audit.service');
    require.cache[auditPath] = { id: auditPath, filename: auditPath, loaded: true, exports: { writeAudit: async () => {} } };
    admin = require('../src/controllers/admin.controller');
    content = require('../src/controllers/content.controller');
    story = require('../src/controllers/story.controller');
  });
  after(async () => {
    if (connection) {
      await connection.query('DROP TEMPORARY TABLE IF EXISTS campaigns, posts');
      connection.release();
    }
    if (pool) await pool.end();
  });
  beforeEach(async () => {
    await connection.query('DELETE FROM campaigns');
    await connection.query('DELETE FROM posts');
  });

  async function call(handler, params = {}, body = {}) {
    const response = {
      statusCode: 200,
      status(code) { this.statusCode = code; return this; },
      json(value) { this.body = value; return this; },
    };
    await handler({ params, body, query: {} }, response, (error) => { throw error; });
    return response;
  }
  const campaign = { slug: 'campaign-test', title: 'Hoạt động từ DB', excerpt: 'Mô tả từ DB', content: 'Dòng một\nDòng hai', status: '', start_date: '2026-10-23', end_date: '2026-10-24', display_order: 2, is_published: false };
  const post = { slug: 'bai-viet-test', title: 'Bài viết từ DB', excerpt: 'Mô tả bài viết', content: 'Nội dung đầy đủ\nDòng thứ hai', category: 'Câu chuyện', is_published: false, published_at: '' };

  test('campaign draft, publish, edit, order, unpublish and delete use the same DB rows', async () => {
    const created = await call(admin.createResource, { resource: 'campaigns' }, campaign);
    assert.equal(created.statusCode, 201);
    const id = created.body.data.id;
    assert.equal((await call(content.listCampaigns)).body.data.length, 0);
    assert.equal((await call(admin.listResource, { resource: 'campaigns' })).body.data.length, 1);
    assert.equal((await call(admin.updateResource, { resource: 'campaigns', id }, { is_published: true, title: 'Đã sửa trong admin' })).statusCode, 200);
    const visible = (await call(content.listCampaigns)).body.data;
    assert.equal(visible[0].id, id);
    assert.equal(visible[0].title, 'Đã sửa trong admin');
    assert.equal(visible[0].content, campaign.content);
    assert.equal(visible[0].startDate, '2026-10-23');
    assert.equal(visible[0].endDate, '2026-10-24');
    assert.equal(visible[0].status, 'upcoming');
    await call(admin.createResource, { resource: 'campaigns' }, { ...campaign, slug: 'first', display_order: 0, is_published: true });
    assert.equal((await call(content.listCampaigns)).body.data[0].slug, 'first');
    await call(admin.updateResource, { resource: 'campaigns', id }, { is_published: '0' });
    assert.equal((await call(content.listCampaigns)).body.data.length, 1);
    await call(admin.deleteResource, { resource: 'campaigns', id });
    assert.equal((await call(admin.listResource, { resource: 'campaigns' })).body.data.length, 1);
  });

  test('posts are accessible by public slug only while published; edits and deletion are reflected', async () => {
    const created = await call(admin.createResource, { resource: 'posts' }, post);
    assert.equal(created.statusCode, 201);
    const id = created.body.data.id;
    assert.equal((await call(content.listPosts)).body.data.length, 0);
    assert.equal((await call(content.getPost, { slug: post.slug })).statusCode, 404);
    await call(admin.updateResource, { resource: 'posts', id }, { is_published: true });
    assert.equal((await call(content.getPost, { slug: post.slug })).body.data.content, post.content);
    await call(admin.updateResource, { resource: 'posts', id }, { title: 'Tiêu đề mới', content: '<script>không thực thi</script>\nVăn bản thuần', slug: 'slug-moi' });
    assert.equal((await call(content.getPost, { slug: post.slug })).statusCode, 404);
    assert.equal((await call(content.getPost, { slug: 'slug-moi' })).body.data.title, 'Tiêu đề mới');
    assert.equal((await call(content.listPosts)).body.data[0].slug, 'slug-moi');
    await call(admin.updateResource, { resource: 'posts', id }, { is_published: false });
    assert.equal((await call(content.getPost, { slug: 'slug-moi' })).statusCode, 404);
    await call(admin.deleteResource, { resource: 'posts', id });
    assert.equal((await call(admin.listResource, { resource: 'posts' })).body.data.length, 0);
  });

  test('invalid admin input returns 422 without saving', async () => {
    for (const body of [
      { ...post, title: '   ' }, { ...post, slug: '../not-a-slug' },
      { ...post, title: 'a'.repeat(256) }, { ...post, published_at: '2026-02-30T12:00' },
      { ...post, published_at: '2026-10-17T25:00' }, { ...post, is_published: 'false' },
    ]) assert.equal((await call(admin.createResource, { resource: 'posts' }, body)).statusCode, 422);
    assert.equal((await call(admin.createResource, { resource: 'campaigns' }, { ...campaign, end_date: '2026-10-01' })).statusCode, 422);
    assert.equal((await call(admin.createResource, { resource: 'campaigns' }, { ...campaign, display_order: -1 })).statusCode, 422);
    const created = await call(admin.createResource, { resource: 'posts' }, post);
    assert.equal((await call(admin.updateResource, { resource: 'posts', id: created.body.data.id }, { content: ' ' })).statusCode, 422);
    assert.equal((await call(content.listPosts)).body.data.length, 0);
  });

  test('campaign migration is repeatable and preserves admin edits', async () => {
    const sql = fs.readFileSync(path.resolve(__dirname, '../database/migrations/006_move_public_campaigns_to_db.sql'), 'utf8');
    const statements = sql.replace(/^--.*$/gm, '').split(';').map((value) => value.trim()).filter(Boolean);
    for (const statement of statements) await connection.query(statement);
    const [rows] = await connection.query('SELECT * FROM campaigns ORDER BY display_order');
    assert.equal(rows.length, 3);
    assert.equal(rows[0].title, 'Những mảnh lụa ghép');
    await connection.execute('UPDATE campaigns SET title = ? WHERE id = ?', ['Admin đã chỉnh sửa', rows[0].id]);
    for (const statement of statements) await connection.query(statement);
    const visible = (await call(content.listCampaigns)).body.data;
    assert.equal(visible.length, 3);
    assert.equal(visible[0].title, 'Admin đã chỉnh sửa');
  });

  async function migrate(file) {
    const sql = fs.readFileSync(path.resolve(__dirname, '../database/migrations', file), 'utf8');
    for (const statement of sql.replace(/^--.*$/gm, '').split(';').map((value) => value.trim()).filter(Boolean)) await connection.query(statement);
  }

  test('fresh migration creates exactly three plain-text posts without storing the static intro', async () => {
    await migrate('008_split_story_posts.sql');
    const response = await call(story.getStory);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body.data.map((post) => post.number), ['01', '02', '03']);
    assert.equal(response.body.data[0].title, 'Lưu giữ dòng chảy di sản & nét đẹp Văn hóa Việt');
    assert.ok(response.body.data[0].content.includes('Chiều sâu di sản:'));
    assert.ok(response.body.data[0].content.includes('\n\nHơi thở làng nghề:'));
    assert.ok(response.body.data[1].content.includes('Giá trị nhân văn:'));
    assert.ok(response.body.data[2].content.includes('Sức sống mới của lụa:'));
    const [rows] = await connection.query('SELECT slug, content, JSON_VALID(content) AS isJson FROM posts');
    assert.equal(rows.length, 3);
    assert.ok(rows.every((row) => row.slug !== 'cau-chuyen-hoa-lua' && row.isJson === 0));
    assert.ok(rows.every((row) => !row.content.includes('Lụa lưu dấu từng nét cọ')));
  });

  test('splitting the old singleton preserves section edits and publication state', async () => {
    await migrate('007_story_page_post.sql');
    const [rows] = await connection.query("SELECT * FROM posts WHERE slug = 'cau-chuyen-hoa-lua'");
    const oldContent = JSON.parse(rows[0].content);
    oldContent.pillars.items[0].title = 'Tiêu đề đã được admin sửa';
    oldContent.pillars.items[1].points[0].text = 'Nội dung đã được admin sửa';
    await connection.execute('UPDATE posts SET content = ?, is_published = 0 WHERE id = ?', [JSON.stringify(oldContent), rows[0].id]);
    await migrate('008_split_story_posts.sql');
    const posts = (await call(story.getAdminStory)).body.data;
    assert.equal(posts.length, 3);
    assert.equal(posts[0].title, 'Tiêu đề đã được admin sửa');
    assert.ok(posts[1].content.includes('Nội dung đã được admin sửa'));
    assert.ok(posts.every((post) => !post.isPublished));
    assert.deepEqual((await call(story.getStory)).body.data, []);
    const [old] = await connection.query("SELECT id FROM posts WHERE slug = 'cau-chuyen-hoa-lua'");
    assert.equal(old.length, 0);
    posts[0].title = 'Chỉnh sửa sau khi tách';
    assert.equal((await call(story.saveStory, { slug: posts[0].slug }, posts[0])).statusCode, 200);
    await migrate('008_split_story_posts.sql');
    assert.equal((await call(story.getAdminStory)).body.data[0].title, 'Chỉnh sửa sau khi tách');
  });

  test('each section is edited and published independently without changing other records', async () => {
    await migrate('008_split_story_posts.sql');
    const original = (await call(story.getAdminStory)).body.data;
    const second = { ...original[1], title: 'Tiêu đề mục 02 mới', content: 'Nhãn mới: Nội dung từ admin\n\nÝ tiếp: Dòng thứ hai', isPublished: false };
    const saved = await call(story.saveStory, { slug: second.slug }, second);
    assert.equal(saved.statusCode, 200);
    assert.equal(saved.body.data.id, second.id);
    const visible = (await call(story.getStory)).body.data;
    assert.deepEqual(visible.map((post) => post.number), ['01', '03']);
    const all = (await call(story.getAdminStory)).body.data;
    assert.deepEqual(all[0], original[0]);
    assert.deepEqual(all[2], original[2]);
    assert.equal(all[1].content, second.content);
    assert.equal(all[1].title, second.title);
    second.isPublished = true;
    await call(story.saveStory, { slug: second.slug }, second);
    assert.deepEqual((await call(story.getStory)).body.data.map((post) => post.number), ['01', '02', '03']);
    await call(admin.createResource, { resource: 'posts' }, { ...post, slug: 'other-post', is_published: true });
    assert.equal((await call(story.getStory)).body.data.length, 3);
  });

  test('invalid section updates are rejected and do not change saved data', async () => {
    await migrate('008_split_story_posts.sql');
    const original = (await call(story.getAdminStory)).body.data[0];
    for (const invalid of [
      { ...original, title: ' ' }, { ...original, title: 'a'.repeat(256) },
      { ...original, content: '' }, { ...original, content: {} },
      { ...original, content: 'a'.repeat(50001) }, { ...original, isPublished: 'true' },
    ]) assert.equal((await call(story.saveStory, { slug: original.slug }, invalid)).statusCode, 422);
    assert.equal((await call(story.saveStory, { slug: 'unknown' }, original)).statusCode, 404);
    assert.deepEqual((await call(story.getAdminStory)).body.data[0], original);
  });
});