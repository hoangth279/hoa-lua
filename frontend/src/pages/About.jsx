import Seo from '../components/Seo';
import hero from '../assets/hoa-lua-hero.png';

const storyPillars = [
  { number: '01', title: 'Lưu giữ dòng chảy di sản & nét đẹp văn hóa Việt', lead: 'Chiều sâu di sản', copy: 'Lụa không chỉ là một chất liệu thủ công, mà là gạch nối lưu giữ lịch sử và bản sắc văn hóa Việt qua hàng thế kỷ.', detail: 'Từ những cuộn lụa ươm tơ truyền thống Vạn Phúc đến từng mảnh lụa vụn, tất cả đều chứa đựng vệt màu thời gian, tình yêu nghề và nhịp đập di sản nghìn năm.' },
  { number: '02', title: 'Lưu giữ đôi tay nghệ nhân & tinh thần sống xanh bền vững', lead: 'Nghệ thuật tái sinh chất liệu', copy: 'Đồng hành cùng Vụn Art, Họa Lụa nhìn thấy ở những mảnh lụa thừa không phải rác thải, mà là một vòng đời mới đầy tiềm năng.', detail: 'Qua sự tỉ mỉ của những “người thợ đặc biệt”, từng mảnh vụn được chọn lọc, cắt ghép để trở thành các bức tranh ghép lụa hay sản phẩm ứng dụng có hồn. Sống xanh hiện hữu trong sinh kế bền vững, sự trân trọng tài nguyên và tình người gửi gắm qua từng nếp vải.' },
  { number: '03', title: 'Lưu giữ sự kết nối & tiếp nối cùng thế hệ trẻ', lead: 'Đưa di sản vào đời sống', copy: 'Họa Lụa không cố đóng khung truyền thống trong không gian bảo tàng hay quá khứ.', detail: 'Chúng tôi tạo điều kiện để nghệ nhân, nghệ sĩ và thế hệ trẻ gặp gỡ, sẻ chia và cùng thực hành sáng tạo. Nhờ đó, lụa tiếp tục chuyển động — trở nên tử tế, bền vững, gần gũi hơn với nhịp sống hôm nay và tự hào đồng hành cùng người trẻ.' },
];

function About() {
  return <div className="inner-page story-page">
    <Seo title="Câu chuyện" description="Câu chuyện Họa Lụa: lưu giữ di sản, tái sinh chất liệu và kết nối các thế hệ." />
    <section className="story-intro"><div className="container story-intro__grid">
      <figure className="story-intro__image"><img src={hero} alt="Dải lụa đỏ và dụng cụ thủ công truyền thống" /></figure>
      <div className="story-intro__content"><p className="section-index">Từ chất liệu đến kết nối</p><h1>Chúng tôi chọn lụa vì lụa biết lưu giữ.</h1><p>Lụa lưu dấu từng nét cọ, từng lớp màu và cả nhịp thở của người tạo tác. Họa Lụa mở ra những không gian để nghệ nhân, nghệ sĩ và công chúng cùng gặp gỡ, chia sẻ và thực hành.</p><p>Chúng tôi không cố đóng khung truyền thống. Chúng tôi tạo điều kiện để truyền thống tiếp tục chuyển động — tử tế, bền vững và gần gũi với hôm nay.</p></div>
    </div></section>
    <section className="story-pillars" aria-labelledby="story-pillars-title"><div className="container">
      <div className="story-pillars__heading"><p className="section-index">Những điều lụa lưu giữ</p><h2 id="story-pillars-title">Từ những mảnh lụa nhỏ,<br /><em>mở ra những kết nối dài lâu.</em></h2></div>
      <div className="story-pillars__list">{storyPillars.map((pillar) => <article className="story-pillar" key={pillar.number}><span className="story-pillar__number">{pillar.number}</span><div><h3>{pillar.title}</h3><p><strong>{pillar.lead}.</strong> {pillar.copy}</p><p>{pillar.detail}</p></div></article>)}</div>
    </div></section>
  </div>;
}

export default About;
