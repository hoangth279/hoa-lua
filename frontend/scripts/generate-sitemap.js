import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.VITE_SITE_URL || 'https://hoalua.online').replace(/\/$/, '');

const staticRoutes = ['/', '/gioi-thieu', '/hoat-dong', '/workshop', '/tin-tuc', '/thu-vien', '/lien-he'];

// Giữ đồng bộ với slug bài viết trong src/data/content.js
const postSlugs = [
  'lua-trong-doi-song-duong-dai',
  'gap-go-nghe-nhan-mau-tu-nhien',
  'nhat-ky-workshop-dau-tien',
];

const urls = [...staticRoutes, ...postSlugs.map((slug) => `/tin-tuc/${slug}`)];

const body = urls
  .map((url) => `  <url>\n    <loc>${SITE_URL}${url}</loc>\n  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Đã tạo ${path.relative(process.cwd(), outputPath)} với ${urls.length} URL.`);
