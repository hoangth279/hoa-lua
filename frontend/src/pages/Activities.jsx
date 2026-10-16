import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Seo from '../components/Seo';
import ContentState from '../components/ContentState';
import { usePublicContent } from '../hooks/usePublicContent';
import { formatDate } from '../data/content';

function Activities() {
  const { data, loading, error, retry } = usePublicContent('/campaigns');
  const campaigns = data || [];
  const { hash } = useLocation();

  useEffect(() => {
    if (loading || !hash) return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    document.getElementById(id)?.scrollIntoView();
  }, [loading, hash]);

  return <div className="inner-page">
    <Seo title="Hoạt động nghệ thuật" description="Khám phá các chiến dịch nghệ thuật cộng đồng của Họa Lụa: tái sinh lụa vụn, tôn vinh thủ công Việt và kết nối thế hệ trẻ." />
    <section className="page-hero page-hero--compact"><div className="container"><p className="eyebrow">Chiến dịch & hoạt động</p><h1 className="page-hero__split-title"><span>Hoạt động nghệ thuật</span><em>cùng Họa Lụa</em></h1></div></section>
    <section className="section"><div className="container campaign-detail-list">
      <p className="section-index">Chuỗi hoạt động Họa Lụa</p>
      <ContentState loading={loading} error={error} empty={!campaigns.length ? 'Hiện chưa có hoạt động nào được công bố.' : ''} onRetry={retry} />
      {campaigns.map((item, index) => <article key={item.id} id={item.slug}>
        <div>
          <span className="campaign-detail-list__number">{String(index + 1).padStart(2, '0')}</span>
          {item.status && <small>{({ upcoming: 'Sắp diễn ra', active: 'Đang diễn ra', completed: 'Đã kết thúc' })[item.status] || item.status}</small>}
          {item.coverImage && <img className="campaign-detail-list__cover" src={item.coverImage} alt="" loading="lazy" />}
        </div>
        <div>
          <h2>{item.title}</h2>
          {(item.startDate || item.endDate) && <p className="card-meta">{item.startDate && formatDate(item.startDate)}{item.startDate && item.endDate ? ' – ' : ''}{item.endDate && <>{!item.startDate && 'Đến '}{formatDate(item.endDate)}</>}</p>}
          <p><strong>{item.excerpt}</strong></p>
          {item.content && <div className="content-copy">{item.content}</div>}
        </div>
      </article>)}
    </div></section>
  </div>;
}
export default Activities;
