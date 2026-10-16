import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.VITE_SITE_URL || 'https://hoalua.online').replace(/\/$/, '');
const API_BASE = (process.env.VITE_API_URL?.startsWith('http') ? process.env.VITE_API_URL : `${SITE_URL}/api`).replace(/\/$/, '');

const staticUrls = ['/', '/gioi-thieu', '/hoat-dong', '/workshop', '/ve-chung-toi', '/thu-vien', '/lien-he'];

async function fetchArticleUrls() {
  try {
    const res = await fetch(`${API_BASE}/articles`);
    const json = await res.json();
    return (json.data || []).map((item) => `/thu-vien/${item.slug}`);
  } catch {
    console.warn('Không lấy được danh sách bài viết cho sitemap, bỏ qua phần động.');
    return [];
  }
}

async function main() {
  const articleUrls = await fetchArticleUrls();
  const urls = [...staticUrls, ...articleUrls];

  const body = urls
    .map((url) => `  <url>\n    <loc>${SITE_URL}${url}</loc>\n  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`Đã tạo ${path.relative(process.cwd(), outputPath)} với ${urls.length} URL.`);
}

main();
