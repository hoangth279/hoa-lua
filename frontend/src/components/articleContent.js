// Preserve legacy plain-text section labels; new content may use Markdown headings.
const legacyHeadings = new Set([
  'Tranh thủ công làm từ lụa là gì?',
  'Từ lụa Vạn Phúc đến một tác phẩm mới',
  'Điều gì làm nên sự tỉ mỉ của tranh ghép lụa?',
  'Giá trị nằm ở đôi bàn tay phía sau tác phẩm',
  'Chạm vào lụa để hiểu thêm về người làm ra nó',
  'Vì sao quà tặng từ lụa có sức hút riêng?',
  'Tranh ghép lụa – món quà dành cho người yêu nghệ thuật',
  'Lót cốc từ lụa – đưa nghệ thuật vào những khoảnh khắc nhỏ',
  'Móc khóa lụa – nhỏ nhưng mang dấu ấn cá nhân',
  'Tote bag với chi tiết lụa – kết hợp thủ công và phong cách hằng ngày',
  'Phụ kiện và chi tiết trang trí từ lụa',
  'Một món quà sẽ ý nghĩa hơn khi bạn hiểu người làm ra nó',
]);

export function parseArticleContent(content = '') {
  return content.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean).map((text, index) => {
    const heading = text.match(/^#{1,3}\s+(.+)$/);
    return { text: heading ? heading[1] : text, type: heading || legacyHeadings.has(text) ? 'heading' : 'paragraph', id: `section-${index}` };
  });
}

export function parseArticleSteps(value) {
  try {
    const steps = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(steps) ? steps.filter((step) => step && typeof step.title === 'string') : [];
  } catch {
    return [];
  }
}

export function articleReadingMinutes(content = '', steps = []) {
  const text = [content, ...steps.map((step) => `${step.title} ${step.body || ''}`)].join(' ');
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 230));
}
