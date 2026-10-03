import Seo from '../components/Seo';

const storyPoints = [
  { number: '01', label: 'Nâng niu từng mảnh lụa vụn', text: 'Ở VỤN Art, không có mảnh lụa nào là bỏ đi. Mỗi mảnh lụa vụn thừa từ làng nghề Vạn Phúc đều mang trong mình màu sắc, đường tơ và câu chuyện văn hóa riêng đang chờ được tiếp nối — và chúng mình muốn lan tỏa cho các bạn trẻ thấy được vẻ đẹp của từng mảnh lụa vụn thông qua từng tác phẩm tỉ mỉ, chau chuốt của VỤN Art.' },
  { number: '02', label: 'Tôn vinh tài nghệ người thợ Vụn Art', text: 'Hình mẫu Vụn Art chính là minh chứng sống động nhất cho sự kiên nhẫn và ngón nghề tinh tế. Qua đôi tay khéo léo của những người thợ đặc biệt, từng mảnh vụn nhỏ được nâng niu, chọn lọc và ghép nối tỉ mẩn để "tái sinh" thành các tác phẩm nghệ thuật đong đầy cảm xúc.' },
  { number: '03', label: 'Kết nối di sản vào đời sống hiện đại', text: 'Chúng mình không đóng khung truyền thống trong quá khứ. Họa Lụa tạo không gian tương tác để người trẻ trực tiếp chạm vào chất liệu, cảm nhận tài nghệ thủ công và đưa nghệ thuật sống xanh bền vững hòa cùng nhịp sống hôm nay.' },
];

function AboutUs() {
  return <div className="inner-page story-page">
    <Seo title="Về chúng tôi" description="Họa Lụa — dự án nghệ thuật của sinh viên Trường Đại học Hà Nội, lấy VỤN Art làm hình mẫu truyền cảm hứng, kết nối di sản lụa Việt với thế hệ trẻ." />
    <section className="page-hero page-hero--compact"><div className="container"><p className="eyebrow">Về chúng tôi</p><h1>Nơi di sản<br /><em>tiếp tục chuyển động.</em></h1><p>Họa Lụa là dự án nghệ thuật của sinh viên Trường Đại học Hà Nội, ra đời với sứ mệnh kết nối nghệ thuật lụa truyền thống Việt Nam với hơi thở đương đại của thế hệ trẻ. Lấy mô hình VỤN Art làm hình mẫu truyền cảm hứng xuyên suốt, Họa Lụa không chỉ tôn vinh giá trị di sản mà còn cùng cộng đồng lan tỏa thông điệp: "Nâng niu tài nghệ trên từng mảnh lụa."</p></div></section>
    <section className="story-pillars" aria-labelledby="about-us-title"><div className="container">
      <div className="story-pillars__heading"><p className="section-index">Câu chuyện của Họa Lụa</p><h2 id="about-us-title">Từ những mảnh lụa nhỏ,<br /><em>dệt nên một hành trình.</em></h2></div>
      <div className="story-pillars__list">{storyPoints.map((point) => <article className="story-pillar" key={point.number}><span className="story-pillar__number">{point.number}</span><div><h3>{point.label}</h3><p>{point.text}</p></div></article>)}</div>
    </div></section>
  </div>;
}

export default AboutUs;
