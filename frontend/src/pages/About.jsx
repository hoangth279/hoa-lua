import Seo from '../components/Seo';
import hero from '../assets/story-silk-collage.jpg';
import ContentState from '../components/ContentState';
import { usePublicContent } from '../hooks/usePublicContent';
import { useFittedTitle } from '../hooks/useFittedTitle';

function PostParagraphs({ content }) {
  return content.split(/\r?\n\s*\r?\n/).filter((paragraph) => paragraph.trim()).map((paragraph, index) => {
    const colon = paragraph.indexOf(':');
    return <p className="content-copy" key={index}>{colon > 0 ? <><strong>{paragraph.slice(0, colon)}:</strong>{' '}{paragraph.slice(colon + 1).trim()}</> : paragraph}</p>;
  });
}

function About() {
  const titleRef = useFittedTitle('Lụa dệt ký ức — giữ màu thời gian');
  const { data, loading, error, retry } = usePublicContent('/story');
  const posts = data || [];

  return <div className="inner-page story-page">
    <Seo title="Câu chuyện Họa Lụa" description="Tìm hiểu câu chuyện Họa Lụa: lưu giữ di sản lụa Việt, tái sinh chất liệu thủ công và kết nối các thế hệ qua nghệ thuật." image={hero} />
    <section className="story-intro"><div className="container story-intro__grid">
      <figure className="story-intro__image"><img src={hero} alt="Đôi tay tỉ mỉ ghép những mảnh vải màu thành bức tranh làng Việt" /></figure>
      <div className="story-intro__content"><p className="section-index">Từ chất liệu đến kết nối</p><h1 ref={titleRef} className="story-intro__title"><span>Lụa dệt ký ức</span><em>giữ màu thời gian</em></h1><p>Lụa lưu dấu từng nét cọ, từng lớp màu và cả nhịp thở của người tạo tác. Họa Lụa mở ra những không gian để nghệ nhân, nghệ sĩ và công chúng cùng gặp gỡ, chia sẻ và thực hành.</p><p>Chúng tôi không cố đóng khung truyền thống. Chúng tôi tạo điều kiện để truyền thống tiếp tục chuyển động — tử tế, bền vững và gần gũi với hôm&nbsp;nay.</p></div>
    </div></section>
    <section className="story-pillars" aria-labelledby="story-pillars-title"><div className="container">
      <div className="story-pillars__heading"><p className="section-index">Những điều lụa lưu giữ</p><h2 id="story-pillars-title" className="story-pillars__split-title"><span>Từ những mảnh lụa nhỏ,</span><em>mở ra những kết nối dài lâu</em></h2></div>
      <div className="story-pillars__list">
        <ContentState loading={loading} error={error} empty={!posts.length ? 'Các mục Câu chuyện đang được cập nhật.' : ''} onRetry={retry} />
        {posts.map((post) => <article className="story-pillar" key={post.id}>
          <span className="story-pillar__number">{post.number}</span>
          <div><h3>{post.title}</h3><PostParagraphs content={post.content} /></div>
        </article>)}
      </div>
    </div></section>
  </div>;
}

export default About;
