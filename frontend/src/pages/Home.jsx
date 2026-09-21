import { Link } from 'react-router-dom';
import heroArtwork from '../assets/hoa-lua-hero.png';
import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';
import { campaigns, posts, workshops, formatDate, formatPrice } from '../data/content';

function Home() {
  return (
    <div className="home-page">
      <Seo description="Họa Lụa là chiến dịch nghệ thuật phi lợi nhuận kết nối lụa, thủ công và văn hóa Việt với đời sống đương đại." />
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero__image" src={heroArtwork} alt="Dải lụa đỏ, khung thêu và dụng cụ nhuộm màu tự nhiên" />
        <div className="hero__veil" />
        <div className="container hero__content">
          <p className="eyebrow">Chiến dịch nghệ thuật phi lợi nhuận</p>
          <h1 id="hero-title">Từ một sợi lụa,<br />dệt nên ngàn kết nối.</h1>
          <p className="hero__lead">Họa Lụa đưa vẻ đẹp của lụa, thủ công và văn hóa Việt vào đời sống đương đại — bằng những trải nghiệm ai cũng có thể chạm, cảm và cùng tạo nên.</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#workshops">Khám phá workshop <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="#story">Đọc câu chuyện <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <p className="hero__caption">01 — Lụa và sắc màu tự nhiên</p>
      </section>
      <section className="manifesto" id="story">
        <div className="container manifesto__grid">
          <p className="section-index">01 / Về Họa Lụa</p>
          <div>
            <p className="manifesto__statement">Không chỉ ngắm nhìn nghệ thuật.<br /><em>Hãy để nghệ thuật chạm vào bạn.</em></p>
            <p className="manifesto__copy">Chúng tôi tin rằng di sản chỉ thực sự sống khi được kể lại bằng ngôn ngữ của hôm nay. Mỗi hoạt động của Họa Lụa là một cuộc gặp giữa nghệ nhân, nghệ sĩ và cộng đồng.</p>
            <Link className="text-link" to="/gioi-thieu">Câu chuyện của chúng tôi <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
      <section className="campaigns section" id="activities">
        <div className="container">
          <SectionHeading index="02" eyebrow="Hoạt động" title={<>Nơi di sản được<br /><em>tiếp tục kể.</em></>} action={<Link className="text-link" to="/hoat-dong">Xem tất cả hoạt động →</Link>} />
          <div className="campaign-list">
            {campaigns.map((item) => <article className="campaign-row" key={item.number}>
              <span className="campaign-row__number">{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
              <span className="campaign-row__status">{item.status}</span>
              <span className="campaign-row__arrow" aria-hidden="true">↗</span>
            </article>)}
          </div>
        </div>
      </section>
      <section className="workshops section" id="workshops">
        <div className="container">
          <SectionHeading index="03" eyebrow="Trải nghiệm" title={<>Chạm tay vào lụa.<br /><em>Chạm vào câu chuyện.</em></>} action={<Link className="text-link" to="/workshop">Lịch workshop →</Link>} />
          <div className="workshop-grid">
            {workshops.slice(0, 3).map((item, index) => <article className={`workshop-card ${index === 0 ? 'workshop-card--featured' : ''}`} key={item.id}>
              <div className="workshop-card__image"><img src={item.image} alt="" /><span>{item.tag}</span></div>
              <div className="workshop-card__body"><p className="card-meta">{formatDate(item.date)} · {item.time}</p><h3>{item.title}</h3><p>{item.excerpt}</p><div className="card-bottom"><strong>{formatPrice(item.price)}</strong><Link to={`/workshop?chon=${item.id}`} aria-label={`Đăng ký ${item.title}`}>Đăng ký <span aria-hidden="true">→</span></Link></div></div>
            </article>)}
          </div>
        </div>
      </section>
      <section className="quote-band"><div className="container"><span>“</span><blockquote>Nghệ thuật không ở đâu xa.<br />Nghệ thuật bắt đầu từ một lần ta dừng lại và chạm thật khẽ.</blockquote><p>— Tuyên ngôn Họa Lụa</p></div></section>
      <section className="journal section">
        <div className="container">
          <SectionHeading index="04" eyebrow="Tin & chuyện" title={<>Những câu chuyện<br /><em>đang được dệt.</em></>} action={<Link className="text-link" to="/tin-tuc">Đọc tất cả →</Link>} />
          <div className="post-grid">{posts.map((post, index) => <article className={`post-card ${index === 0 ? 'post-card--large' : ''}`} key={post.slug}><Link to={`/tin-tuc/${post.slug}`} className="post-card__image"><img src={post.image} alt="" /></Link><p className="card-meta">{post.category} · {post.date}</p><h3><Link to={`/tin-tuc/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p></article>)}</div>
        </div>
      </section>
      <section className="join"><div className="container join__inner"><p className="section-index">Cùng Họa Lụa tạo nên điều đẹp đẽ</p><h2>Mỗi bàn tay góp vào,<br /><em>một câu chuyện được nối dài.</em></h2><p>Bạn có thể tham dự workshop, trở thành tình nguyện viên, đồng hành chuyên môn hoặc đơn giản là kể câu chuyện Họa Lụa cho một người bạn.</p><Link className="button button--light" to="/lien-he">Tham gia cùng chúng tôi →</Link></div></section>
    </div>
  );
}

export default Home;
