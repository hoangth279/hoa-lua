import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import ContentState from '../components/ContentState';
import ArticleTitle from '../components/ArticleTitle';
import { usePublicContent } from '../hooks/usePublicContent';
import heroArtwork from '../assets/hoa-lua-hero.png';

function Gallery() {
  const { data, loading, error, retry } = usePublicContent('/articles');
  const articles = data || [];

  return (
    <div className="inner-page library-page">
      <Seo title="Thông tin hữu ích" description="Những bài viết về nghệ thuật ghép lụa vụn, quà tặng thủ công và quy trình làm tranh lụa tại VỤN Art." image={heroArtwork} />
      <section className="page-hero page-hero--compact">
        <div className="container">
          <p className="eyebrow">Thư viện</p>
          <h1 className="page-hero__split-title"><span>Thông tin hữu ích</span><em>câu chuyện phía sau từng mảnh lụa</em></h1>
        </div>
      </section>
      <section className="section"><div className="container">
        <div className="workshop-grid workshop-grid--equal">
          <ContentState loading={loading} error={error} empty={!articles.length ? 'Hiện chưa có bài viết nào được công bố.' : ''} onRetry={retry} />
          {articles.map((item) => (
            <article className="workshop-card" key={item.id}>
              <Link className="workshop-card__image" to={`/thu-vien/${item.slug}`} aria-label={`Đọc bài: ${item.title}`}><img src={item.coverImage || heroArtwork} alt="" loading="lazy" /></Link>
              <div className="workshop-card__body">
                <Link className="library-card-link" to={`/thu-vien/${item.slug}`}><ArticleTitle as="h2" title={item.title} /></Link>
                <p>{item.excerpt}</p>
                <div className="card-bottom"><Link to={`/thu-vien/${item.slug}`}>Đọc tiếp <span aria-hidden="true">→</span></Link></div>
              </div>
            </article>
          ))}
        </div>
      </div></section>
    </div>
  );
}

export default Gallery;
