const fs = require('fs');
const path = require('path');

const databaseRoot = path.resolve(__dirname, '../database');
const sources = [
  'migrations/001_initial_schema.sql',
  'migrations/002_admin_management.sql',
  'migrations/003_update_contact_channels.sql',
  'seeds/001_demo_content.sql',
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
