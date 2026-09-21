import Seo from '../components/Seo';
import ContactForm from '../components/ContactForm';
import { contactInfo } from '../data/contact';

function Contact() {
  return <div className="inner-page">
    <Seo title="Liên hệ" description="Liên hệ, hợp tác và đồng hành cùng chiến dịch nghệ thuật Họa Lụa." />
    <section className="page-hero page-hero--compact"><div className="container"><p className="eyebrow">Liên hệ & đồng hành</p><h1>Cùng nhau dệt nên<br /><em>một điều đẹp đẽ.</em></h1></div></section>
    <section className="contact-section"><div className="container contact-grid">
      <div><p className="section-index">Kết nối với Họa Lụa</p><h2>Một lời chào cũng có thể mở đầu cho một hành trình.</h2><p>Nếu bạn muốn tham gia, hợp tác chuyên môn, tài trợ địa điểm hoặc chia sẻ một câu chuyện về lụa — hãy viết cho chúng tôi.</p>
        <dl>
          <dt>Email</dt><dd><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></dd>
          <dt>Điện thoại</dt><dd><a href={`tel:${contactInfo.phoneHref}`}>{contactInfo.phoneDisplay}</a></dd>
          <dt>Địa chỉ</dt><dd>{contactInfo.address}</dd>
          <dt>Mạng xã hội</dt><dd className="contact-social"><a href={contactInfo.facebook} target="_blank" rel="noreferrer">Facebook ↗</a><a href={contactInfo.tiktok} target="_blank" rel="noreferrer">TikTok ↗</a></dd>
        </dl>
      </div>
      <ContactForm />
    </div></section>
  </div>;
}
export default Contact;
