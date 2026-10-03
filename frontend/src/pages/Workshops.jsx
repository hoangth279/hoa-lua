import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import BookingForm from '../components/BookingForm';
import { useWorkshops } from '../hooks/useWorkshops';
import { formatApiDate, formatApiTimeRange, formatPrice } from '../data/content';
import heroArtwork from '../assets/hoa-lua-hero.png';

function Workshops() {
  const [params] = useSearchParams();
  const location = useLocation();
  const { workshops, loading } = useWorkshops();
  const [manualId, setManualId] = useState(null);
  const queryId = Number(params.get('chon')) || null;
  const selectedId = manualId ?? queryId;
  const workshop = useMemo(() => workshops.find((w) => w.id === selectedId) || workshops[0], [workshops, selectedId]);

  useEffect(() => {
    if (location.hash === '#booking' && !loading) {
      document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash, loading]);

  return (
    <div className="inner-page">
      <Seo title="Workshop" description="Lịch workshop lụa, màu tự nhiên và trải nghiệm nghệ thuật của Họa Lụa." />
      <section className="page-hero page-hero--compact"><div className="container"><p className="eyebrow">Workshop & trải nghiệm</p><h1>Học bằng đôi tay.<br /><em>Nhớ bằng trái tim.</em></h1><p>Không cần kinh nghiệm. Chỉ cần bạn mang theo sự tò mò và một chút thời gian cho chính mình.</p></div></section>
      <section className="section"><div className="container workshop-list">
        {loading && <p>Đang tải lịch workshop…</p>}
        {!loading && !workshops.length && <p>Hiện chưa có workshop nào được mở đăng ký.</p>}
        {workshops.map((item) => <article className={workshop?.id === item.id ? 'workshop-list__item is-selected' : 'workshop-list__item'} key={item.id}>
          <img src={item.coverImage || heroArtwork} alt="" />
          <div>
            <p className="card-meta">{item.category}</p>
            <h2>{item.title}</h2>
            <p>{item.excerpt}</p>
            <ul>
              <li>{formatApiDate(item.startsAt)} · {formatApiTimeRange(item.startsAt, item.endsAt)}</li>
              <li>{item.location}</li>
              <li>{item.availableSeats} chỗ còn trống · {formatPrice(item.price)}</li>
            </ul>
          </div>
          <button className="button" onClick={() => { setManualId(item.id); document.querySelector('#booking')?.scrollIntoView(); }}>Chọn workshop →</button>
        </article>)}
      </div></section>
      <section id="booking" className="booking-section"><div className="container">
        {workshop && <BookingForm workshop={{ ...workshop, date: formatApiDate(workshop.startsAt), time: formatApiTimeRange(workshop.startsAt, workshop.endsAt) }} />}
      </div></section>
    </div>
  );
}
export default Workshops;
