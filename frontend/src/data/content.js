export const formatDate = (value) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
export const formatPrice = (value) => Number(value) === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const VN_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const formatApiDate = (iso) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: VN_TIMEZONE }).format(new Date(iso));
export const formatApiTimeRange = (startIso, endIso) => {
  const time = new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: VN_TIMEZONE });
  return `${time.format(new Date(startIso))} – ${time.format(new Date(endIso))}`;
};
