import heroArtwork from '../assets/hoa-lua-hero.png';
import logo from '../assets/logo.jpg';

export const workshops = [
  { id: 1, slug: 've-lua-cung-mau-tu-nhien', title: 'Vẽ lụa cùng màu tự nhiên', excerpt: 'Khám phá độ thấm, độ loang và tự tay hoàn thiện một bức lụa nhỏ bằng bảng màu từ cây cỏ.', date: '2026-10-18', time: '09:00 – 12:00', location: 'Nhà Văn hóa Nghệ thuật, TP.HCM', capacity: 16, price: 0, image: heroArtwork, tag: 'Dành cho người mới' },
  { id: 2, slug: 'nhuom-lua-tu-cay-co', title: 'Nhuộm lụa từ cây cỏ', excerpt: 'Học cách chiết màu từ lá, vỏ cây và tạo hoa văn độc bản bằng kỹ thuật buộc nhuộm.', date: '2026-10-25', time: '14:00 – 17:00', location: 'Xưởng Họa Lụa, TP.HCM', capacity: 12, price: 250000, image: heroArtwork, tag: 'Thực hành chuyên sâu' },
  { id: 3, slug: 'ke-chuyen-tren-lua', title: 'Kể chuyện trên lụa', excerpt: 'Một buổi sáng cho gia đình cùng phác họa ký ức, kể câu chuyện nhỏ bằng đường nét và sắc màu.', date: '2026-11-01', time: '09:00 – 11:30', location: 'Thư viện Khoa học Tổng hợp, TP.HCM', capacity: 20, price: 0, image: logo, tag: 'Gia đình & trẻ em' },
];

export const campaigns = [
  { number: '01', title: 'Một mét lụa, một câu chuyện', text: 'Mời cộng đồng góp một mảnh ký ức để cùng tạo nên tác phẩm lụa dài được trưng bày lưu động.', status: 'Đang diễn ra' },
  { number: '02', title: 'Sắc Việt từ cây cỏ', text: 'Chuỗi trò chuyện và thực hành về màu nhuộm bản địa, góp phần lưu giữ tri thức thủ công bền vững.', status: 'Tháng 10.2026' },
  { number: '03', title: 'Lụa đi qua phố', text: 'Đưa tác phẩm lụa vào những không gian quen thuộc để nghệ thuật trở thành một phần của đời sống.', status: 'Sắp diễn ra' },
];

export const posts = [
  { slug: 'lua-trong-doi-song-duong-dai', category: 'Câu chuyện', date: '12.09.2026', title: 'Lụa trong đời sống đương đại: mềm mại nhưng không mong manh', excerpt: 'Khi chất liệu truyền thống bước ra khỏi khung tranh và trở thành một cuộc đối thoại mới.', image: heroArtwork },
  { slug: 'gap-go-nghe-nhan-mau-tu-nhien', category: 'Chân dung', date: '05.09.2026', title: 'Gặp người giữ màu từ lá, vỏ cây và đất', excerpt: 'Một buổi trò chuyện về sự kiên nhẫn, ký ức và những gam màu không bao giờ lặp lại.', image: logo },
  { slug: 'nhat-ky-workshop-dau-tien', category: 'Nhật ký', date: '28.08.2026', title: 'Những nét cọ đầu tiên trên lụa', excerpt: 'Nhìn lại buổi gặp gỡ nơi mỗi người mang về một tác phẩm và để lại một câu chuyện.', image: heroArtwork },
];

export const formatDate = (value) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
export const formatPrice = (value) => value === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
