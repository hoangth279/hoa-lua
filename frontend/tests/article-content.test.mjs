import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { articleReadingMinutes, parseArticleContent, parseArticleSteps } from '../src/components/articleContent.js';

test('existing seeded articles retain their text and expose every section', () => {
  const sql = readFileSync(new URL('../../backend/database/migrations/009_add_articles.sql', import.meta.url), 'utf8');
  const articles = [...sql.matchAll(/'(Tranh thủ công làm từ lụa: Khi[^']*|Quà tặng làm từ lụa: Khi[^']*)',\r?\nNULL/g)];
  assert.equal(articles.length, 2);
  articles.forEach((match, index) => {
    const content = match[1].replace(/\\n/g, '\n');
    const blocks = parseArticleContent(content);
    assert.equal(blocks.filter((block) => block.type === 'heading').length, [5, 7][index]);
    assert.equal(blocks.map((block) => block.text).join('\n\n'), content);
    assert.equal(new Set(blocks.map((block) => block.id)).size, blocks.length);
  });
});

test('Markdown headings work with single newlines and Windows line endings', () => {
  const blocks = parseArticleContent('Mở đầu.\r\n## Chất liệu\r\nLụa Vạn Phúc.\r\nMàu sắc.\r\n\r\n### Hoàn thiện\r\nKết thúc.');
  assert.deepEqual(blocks.map(({ type, text }) => [type, text]), [
    ['paragraph', 'Mở đầu.'], ['heading', 'Chất liệu'],
    ['paragraph', 'Lụa Vạn Phúc.\nMàu sắc.'], ['heading', 'Hoàn thiện'], ['paragraph', 'Kết thúc.'],
  ]);
  assert.deepEqual(parseArticleContent(null), []);
  assert.equal(parseArticleContent('Một câu ngắn.')[0].type, 'paragraph');
});

test('invalid or missing steps do not break the article', () => {
  for (const input of [null, '', '{invalid', '{}', 'null']) assert.deepEqual(parseArticleSteps(input), []);
  assert.deepEqual(parseArticleSteps('[null,{}, {"title":"Cắt lụa","step":"01"}]'), [{ title: 'Cắt lụa', step: '01' }]);
  assert.equal(parseArticleSteps([{ title: 'Ghép lụa' }]).length, 1);
});

test('reading estimate includes step descriptions and stays above zero', () => {
  assert.equal(articleReadingMinutes(''), 1);
  assert.equal(articleReadingMinutes('Từ '.repeat(230), [{ title: 'Bước tiếp', body: 'Từ '.repeat(230) }]), 3);
});
