import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.VITE_SITE_URL || 'https://hoalua.online').replace(/\/$/, '');

const urls = ['/', '/gioi-thieu', '/hoat-dong', '/workshop', '/ve-chung-toi', '/thu-vien', '/lien-he'];

const body = urls
  .map((url) => `  <url>\n    <loc>${SITE_URL}${url}</loc>\n  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Đã tạo ${path.relative(process.cwd(), outputPath)} với ${urls.length} URL.`);
