const fs = require('fs');
const path = require('path');

const databaseRoot = path.resolve(__dirname, '../database');
const sources = [
  'migrations/001_initial_schema.sql',
  'migrations/002_admin_management.sql',
  'migrations/003_update_contact_channels.sql',
  'migrations/004_add_instagram_contact.sql',
  'seeds/001_demo_content.sql',
  'migrations/005_update_workshops_content.sql',
  'migrations/006_move_public_campaigns_to_db.sql',
  'migrations/008_split_story_posts.sql',
  'migrations/009_add_articles.sql',
  'migrations/010_add_threads_contact.sql',
  'migrations/011_update_article_covers.sql',
  'migrations/012_add_article_body_images.sql',
  'migrations/013_add_article_focus_keyword.sql',
];

const sql = sources.map((relativePath) => {
  let content = fs.readFileSync(path.join(databaseRoot, relativePath), 'utf8');
  content = content.replace(/CREATE DATABASE[\s\S]*?;\s*/i, '');
  content = content.replace(/^USE\s+hoa_lua;\s*/im, '');
  return `-- Source: ${relativePath}\n${content.trim()}`;
}).join('\n\n');

const outputDirectory = path.join(databaseRoot, 'hostinger');
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, 'production.sql'), `-- Họa Lụa production schema for Hostinger/phpMyAdmin\n-- Select the target database before importing this file.\n\n${sql}\n`, 'utf8');
console.log('Đã tạo backend/database/hostinger/production.sql');
