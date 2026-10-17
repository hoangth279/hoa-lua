import Seo from '../components/Seo';
import ContactForm from '../components/ContactForm';
import SocialLinks from '../components/SocialLinks';
import { useContactInfo } from '../hooks/useContactInfo';
import heroArtwork from '../assets/contact-connection.jpg';
import './contact.css';

function Contact() {
  const { contactInfo } = useContactInfo();
  return <div className="inner-page contact-page">
    <Seo title="Liên hệ & hợp tác" description="Liên hệ Họa Lụa để tham gia workshop, hợp tác chuyên môn, tài trợ địa điểm hoặc đồng hành cùng dự án nghệ thuật cộng đồng." />
    <section className="page-hero contact-hero"><div className="container contact-hero__inner">
      <div><p className="eyebrow">Liên hệ & đồng hành</p><h1>Một lời chào,<br /><em>mở một kết nối.</em></h1><p className="contact-hero__lead">Từ một buổi workshop đến một ý tưởng đồng hành — mọi câu chuyện đều có thể bắt đầu ở đây.</p></div>
      <figure className="contact-hero__art"><img src={heroArtwork} alt="Hai người trao nhau bức tranh ghép vải thủ công trong không gian sáng tạo" /><figcaption>Kết nối từ những điều giản dị.</figcaption></figure>
    </div></section>
    <section className="contact-section" aria-labelledby="contact-title"><div className="container contact-grid">
      <div className="contact-info"><p className="section-index">Kết nối với Họa Lụa</p><h2 id="contact-title">Cùng viết tiếp<br />câu chuyện của lụa</h2><p>Bạn muốn tham gia, hợp tác chuyên môn, tài trợ địa điểm hay chia sẻ một câu chuyện về lụa? Hãy gửi lời nhắn cho chúng tôi.</p>
        <dl className="contact-details">
          <div><dt>Email</dt><dd><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></dd></div>
          <div><dt>Điện thoại</dt><dd><a href={`tel:${contactInfo.phoneHref}`}>{contactInfo.phoneDisplay}</a></dd></div>
          <div><dt>Ghé thăm</dt><dd>{contactInfo.address}</dd></div>
        </dl>
        <div className="contact-follow"><p className="section-index">Gặp Họa Lụa mỗi ngày</p><SocialLinks contactInfo={contactInfo} /></div>
      </div>
      <ContactForm />
    </div></section>
  </div>;
}
export default Contact;
