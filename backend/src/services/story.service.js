const STORY_POSTS = [
  { slug: 'luu-giu-di-san-van-hoa-viet', number: '01' },
  { slug: 'luu-giu-nghe-nhan-song-xanh', number: '02' },
  { slug: 'luu-giu-ket-noi-the-he-tre', number: '03' },
];
const STORY_SLUGS = STORY_POSTS.map(({ slug }) => slug);

function parseStoryPost(row) {
  return {
    id: row.id, slug: row.slug, number: STORY_POSTS.find(({ slug }) => slug === row.slug).number,
    title: row.title, content: row.content, isPublished: Boolean(row.is_published),
  };
}

module.exports = { STORY_POSTS, STORY_SLUGS, parseStoryPost };