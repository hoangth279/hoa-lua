export const vnPhoneRegex = /^(?:\+84|0)[35789]\d{8}$/;
const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;

export function validateBookingContact({ phone, email }) {
  const errors = {};
  if (!vnPhoneRegex.test(phone.trim())) {
    errors.phone = 'Vui lòng nhập số điện thoại Việt Nam hợp lệ, ví dụ 0912345678 hoặc +84912345678.';
  }
  if (email.trim().length > 190 || !emailRegex.test(email.trim())) {
    errors.email = 'Vui lòng nhập email hợp lệ, ví dụ ban@example.com (tối đa 190 ký tự).';
  }
  return errors;
}
