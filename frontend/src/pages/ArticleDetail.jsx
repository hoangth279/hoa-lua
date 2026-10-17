import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import ContentState from '../components/ContentState';
import ArticleTableOfContents from '../components/ArticleTableOfContents';
import NotFound from './NotFound';
import { usePublicContent } from '../hooks/usePublicContent';
import { articleReadingMinutes, parseArticleContent, parseArticleSteps } from '../components/articleContent';

const highlights = /(\*\*[^*]+\*\*|Nâng niu tài nghệ trên từng mảnh lụa|Chạm để thấy tài nghệ|sự kiên nhẫn, độ chính xác và cảm quan thẩm mỹ|khả năng sáng tạo, sự kiên trì và tay nghề|văn hóa, nghệ thuật và tài nghệ)/g;

function Emphasis({ text }) {
  return text.split(highlights).map((part, index) => index % 2 ? <strong key={index}>{part.replace(/^\*\*|\*\*$/g, '')}</strong> : part);
}

function ArticleDetail() {
  const { slug } = useParams();
  const { data: item, loading, error, status, retry } = usePublicContent(`/articles/${slug}`);
  if (status === 404) return <NotFound />;
  if (!item) return <div className="inner-page"><Seo title="Bài viết" noIndex /><section className="section"><div className="container"><ContentState loading={loading} error={error} onRetry={retry} /></div></section></div>;

  const steps = parseArticleSteps(item.stepsJson);
  const blocks = parseArticleContent(item.content);
  const contents = [
    ...blocks.filter((block) => block.type === 'heading').map(({ id, text }) => ({ id, text })),
    ...steps.map((step, index) => ({ id: `step-${index}`, text: `${step.step || index + 1}. ${step.title}` })),
  ];
  const colon = item.title.indexOf(':');
  const title = colon > 0 ? item.title.slice(0, colon) : item.title;
  const subtitle = colon > 0 ? item.title.slice(colon + 1).trim() : '';
  const hasIntroTitle = blocks[0]?.type === 'paragraph' && /^(Tranh thủ công làm từ lụa:|Quà tặng làm từ lụa:)/.test(blocks[0].text);

  return <article className="inner-page library-article">
    <Seo title={item.title} description={item.excerpt} image={item.coverImage} type="article" publishedAt={item.publishedAt} keywords={item.focusKeyword} />
    <header className="article-header">
      <div className="container">
        <nav className="article-breadcrumb" aria-label="Đường dẫn"><Link to="/thu-vien">← Thư viện</Link><span aria-hidden="true">/</span><span>Thông tin hữu ích</span></nav>
        <p className="eyebrow">Chuyện từ những mảnh lụa</p>
        <h1>{title}{subtitle && <><span className="sr-only">: </span><span className="article-title__subtitle">{subtitle}</span></>}</h1>
        <p className="article-deck">{item.excerpt}</p>
        <p className="article-meta">Họa Lụa <span aria-hidden="true">·</span> Khoảng {articleReadingMinutes(item.content, steps)} phút đọc</p>
      </div>
    </header>
    {item.coverImage && <img className="article-cover" src={item.coverImage} alt={title} fetchPriority="high" />}
    <div className={`container article-layout${contents.length ? '' : ' article-layout--simple'}`}>
      {contents.length > 0 && <aside className="article-sidebar"><ArticleTableOfContents key={item.slug} entries={contents} /></aside>}
      <div className="article-body">
        <aside className="article-summary" aria-label="Đọc nhanh"><p className="article-summary__label">Đọc nhanh</p><p>{steps.length ? `Hành trình tạo nên tranh ghép lụa qua ${steps.length} công đoạn: từ ý tưởng, chuẩn bị chất liệu đến hoàn thiện tác phẩm.` : item.slug === 'qua-tang-lam-tu-lua' ? 'Từ tranh ghép lụa, lót cốc đến phụ kiện: chọn một món quà phù hợp với người nhận và khám phá câu chuyện của người làm ra nó.' : item.slug === 'tranh-thu-cong-lam-tu-lua' ? 'Khám phá chất liệu lụa Vạn Phúc, sự tỉ mỉ trong nghệ thuật ghép lụa và tài nghệ của những người đứng sau tác phẩm.' : item.excerpt}</p></aside>
        <div className="article-prose">{blocks.map((block, index) => block.type === 'heading' ? <h2 id={block.id} key={block.id}>{block.text}</h2> : block.type === 'gallery' ? <div className={`article-gallery${block.images.length > 1 ? ' article-gallery--pair' : ''}`} key={block.id}>{block.images.map((img, i) => <img src={img.url} alt={img.alt} loading="lazy" key={i} />)}</div> : hasIntroTitle && index === 0 ? <p className="article-intro-title" key={block.id}>{block.text}</p> : <p key={block.id}><Emphasis text={block.text} /></p>)}</div>
        {steps.length > 0 && <div className="article-steps">{steps.map((step, index) => <section className="article-step" id={`step-${index}`} key={index}>
          <div className="article-step__heading"><span className="article-step__number">{step.step || String(index + 1).padStart(2, '0')}</span><h2>{step.title}</h2></div>
          {step.image && <img src={step.image} alt={step.title} loading="lazy" />}
          <p><Emphasis text={step.body || ''} /></p>
        </section>)}</div>}
        {item.slug !== 'qua-tang-lam-tu-lua' && <aside className="article-cta"><p className="eyebrow">Tự tay trải nghiệm</p><h2>Chạm vào lụa, khám phá tài nghệ</h2><p>Thử ghép những mảnh lụa và tạo nên tác phẩm mang dấu ấn của riêng bạn.</p><Link className="button button--primary" to="/workshop">Khám phá workshop <span aria-hidden="true">→</span></Link></aside>}
        <p className="article-back"><Link className="text-link" to="/thu-vien">← Xem tất cả bài viết</Link></p>
      </div>
    </div>
  </article>;
}

export default ArticleDetail;
