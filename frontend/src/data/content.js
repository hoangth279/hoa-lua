export const campaignsHeading = 'Chuỗi hoạt động Họa Lụa';

export const campaigns = [
  { number: '01', title: 'Sắc Lụa Vụn', lead: 'Khám phá câu chuyện chất liệu và sự tỉ mẩn từ đôi tay thợ thủ công.', detail: 'Chuỗi trò chuyện (talkshow) giúp mọi người hiểu thêm về kỹ thuật cắt tỉa cũng như về chất liệu thủ công bản địa. Hoạt động tôn vinh nét đẹp chất liệu lụa truyền thống, giúp cộng đồng lắng nghe câu chuyện thương hiệu VỤN Art và cảm nhận sâu sắc cái "tâm", sự tỉ mỉ trong từng mảnh lụa của nghệ nhân.' },
  { number: '02', title: 'Tài Nghệ Lụa Xanh', lead: 'Nghệ thuật tái sinh lụa vụn – Đưa lối sống xanh hòa vào nhịp sống phố thị.', detail: 'Đưa các tác phẩm lụa tái chế (sản phẩm của Vụn Art) vào những không gian quen thuộc như góc phố, quán xá đời thường. Hoạt động lan tỏa thẩm mỹ lụa ghép nghệ thuật và cảm hứng sống xanh bền vững, chứng minh rằng chất liệu thừa hoàn toàn có thể "tái sinh" thành một phần đẹp đẽ trong cuộc sống thường nhật.' },
  { number: '03', title: 'Chuyện Thanh Xuân', lead: 'Góp một mảnh ký ức – Dệt nên câu chuyện thanh xuân cùng cộng đồng.', detail: 'Mời cộng đồng trẻ cùng tham gia đóng góp những mảnh lụa vụn và mảnh ký ức cá nhân để tạo nên một tác phẩm lụa nối dài được trưng bày lưu động. Hoạt động tạo ra không gian mở để người trẻ gặp gỡ, sẻ chia và lưu dấu những khoảnh khắc thanh xuân đồng hành cùng di sản lụa Việt.' },
];

export const formatDate = (value) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
export const formatPrice = (value) => Number(value) === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const VN_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const formatApiDate = (iso) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: VN_TIMEZONE }).format(new Date(iso));
export const formatApiTimeRange = (startIso, endIso) => {
  const time = new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: VN_TIMEZONE });
  return `${time.format(new Date(startIso))} – ${time.format(new Date(endIso))}`;
};
