import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { contactInfo } from '../data/contact';

const links = [
  ['/', 'Trang chủ'],
  ['/gioi-thieu', 'Câu chuyện'],
  ['/hoat-dong', 'Hoạt động'],
  ['/workshop', 'Workshop'],
  ['/tin-tuc', 'Tin tức'],
  ['/thu-vien', 'Thư viện'],
];

function MainLayout() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.toggle('menu-open', open);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('menu-open');
    };
  }, [open]);
  return (
    <>
      <header className="site-header">
        <div className="container header__inner">
          <Link to="/" className="brand" aria-label="Họa Lụa - Trang chủ" onClick={() => setOpen(false)}>
            <img src={logo} alt="Họa Lụa" />
          </Link>
          <button className="menu-toggle" type="button" aria-label={open ? 'Đóng menu' : 'Mở menu'} aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen((value) => !value)}>
            <span /> <span /> <span className="sr-only">Mở menu</span>
          </button>
          {open && <button className="nav-backdrop" type="button" aria-label="Đóng menu" onClick={() => setOpen(false)} />}
          <nav id="main-menu" className={open ? 'nav nav--open' : 'nav'} aria-label="Điều hướng chính">
            {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}
          </nav>
          <Link className="button button--small header__cta" to="/lien-he">Tham gia cùng chúng tôi</Link>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer"><div className="container footer__grid"><div><img src={logo} alt="" /><p>Họa Lụa — nơi nghệ thuật, thủ công và văn hóa Việt gặp gỡ đời sống đương đại.</p></div><div><h2>Khám phá</h2>{links.slice(1).map(([to,label])=><Link key={to} to={to}>{label}</Link>)}</div><div><h2>Kết nối</h2><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a><a href={`tel:${contactInfo.phoneHref}`}>{contactInfo.phoneDisplay}</a><p className="footer__address">{contactInfo.address}</p><div className="footer__social"><a href={contactInfo.facebook} target="_blank" rel="noreferrer">Facebook ↗</a><a href={contactInfo.tiktok} target="_blank" rel="noreferrer">TikTok ↗</a></div></div></div><div className="container footer__bottom"><span>© 2026 Họa Lụa. Một dự án nghệ thuật phi lợi nhuận.</span><Link to="/lien-he">Liên hệ</Link></div></footer>
    </>
  );
}

export default MainLayout;
