import { useEffect, useRef, useState } from 'react';
import heroArtwork from '../assets/hoa-lua-hero.png';
import workshopArtwork from '../assets/workshop-silk-collage.jpg';
import kitArtwork from '../assets/workshop-art-kit.jpg';
import connectionArtwork from '../assets/contact-connection.jpg';
import './hero-slideshow.css';

const slides = [
  { src: heroArtwork, caption: 'Lụa và sắc màu tự nhiên', position: '62% center' },
  { src: workshopArtwork, caption: 'Cùng chạm vào nghệ thuật ghép lụa', position: '65% center' },
  { src: kitArtwork, caption: 'Sáng tạo từ những mảnh lụa nhỏ', position: '70% center' },
  { src: connectionArtwork, caption: 'Kết nối từ những điều giản dị', position: '60% center' },
];

export default function HeroSlideshow() {
  const artworkRef = useRef(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState([]);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const updateVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting)) : null;
    if (artworkRef.current) observer?.observe(artworkRef.current);
    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (paused || !visible || !tabVisible || ready.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        // Skip images that have not loaded or failed; keep the current image visible.
        for (let offset = 1; offset < slides.length; offset += 1) {
          const next = (current + offset) % slides.length;
          if (ready.includes(next)) return next;
        }
        return current;
      });
    }, 2000);
    return () => window.clearInterval(timer);
  }, [paused, visible, tabVisible, ready, active]);

  return <>
    <div className="hero-slideshow" ref={artworkRef} aria-hidden="true">
      {slides.map((slide, index) => <img
        key={slide.src}
        className={`hero__image hero-slideshow__image${active === index ? ' is-active' : ''}`}
        src={slide.src}
        alt=""
        style={{ objectPosition: slide.position }}
        fetchPriority={index === 0 ? 'high' : 'low'}
        decoding={index === 0 ? 'auto' : 'async'}
        onLoad={() => setReady((loaded) => loaded.includes(index) ? loaded : [...loaded, index])}
      />)}
    </div>
    <p className="hero__caption">{String(active + 1).padStart(2, '0')} — {slides[active].caption}</p>
    <div className="hero-slideshow__controls" role="group" aria-label="Ảnh nổi bật">
      {slides.map((slide, index) => <button
        key={slide.src}
        type="button"
        className="hero-slideshow__dot"
        aria-label={`Xem ảnh ${index + 1}: ${slide.caption}`}
        aria-pressed={active === index}
        disabled={!ready.includes(index)}
        onClick={() => setActive(index)}
      ><span /></button>)}
      <button
        className="hero-slideshow__pause"
        type="button"
        aria-label={paused ? 'Tiếp tục chuyển ảnh tự động' : 'Tạm dừng chuyển ảnh tự động'}
        onClick={() => setPaused((value) => !value)}
      ><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span></button>
    </div>
  </>;
}
