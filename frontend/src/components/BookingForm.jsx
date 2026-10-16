import { useState } from 'react';
import api from '../api/axios';
import WorkshopTitle from './WorkshopTitle';
import { validateBookingContact, vnPhoneRegex } from '../utils/bookingValidation';

const initial = { fullName: '', email: '', phone: '', participants: 1, note: '' };

function BookingForm({ workshop, onSuccess }) {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState({ loading: false, error: '', success: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const update = (event) => {
    const { name, value } = event.target;
    const next = { ...form, [name]: name === 'phone' || name === 'email' ? value.trim() : value };
    setForm(next);
    if (fieldErrors[name]) {
      setFieldErrors((errors) => ({ ...errors, [name]: validateBookingContact(next)[name] }));
    }
  };
  const validateField = (event) => {
    const { name, validity } = event.target;
    const message = validateBookingContact(form)[name]
      || (validity.valid ? undefined : 'Vui lòng nhập email hợp lệ, ví dụ ban@example.com.');
    setFieldErrors((errors) => ({ ...errors, [name]: message }));
  };
  const submit = async (event) => {
    event.preventDefault();
    const errors = validateBookingContact(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      event.currentTarget.elements.namedItem(Object.keys(errors)[0])?.focus();
      return;
    }
    setState({ loading: true, error: '', success: '' });
    try {
      const { data } = await api.post('/bookings', { ...form, participants: Number(form.participants), workshopId: workshop.id });
      setState({ loading: false, error: '', success: data.message || 'Đăng ký thành công. Họa Lụa sẽ sớm liên hệ xác nhận!' });
      setForm(initial);
      setFieldErrors({});
      onSuccess?.(data);
    } catch (error) {
      setFieldErrors(error.response?.data?.errors || {});
      setState({ loading: false, success: '', error: error.response?.data?.message || 'Chưa thể gửi đăng ký. Vui lòng thử lại sau.' });
    }
  };
  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-card__intro"><p className="eyebrow">Đăng ký tham dự</p><WorkshopTitle as="h2" title={workshop.title} /><p>{workshop.date} · {workshop.time}<br />{workshop.location}</p></div>
      <div className="field-grid">
        <label className="field"><span>Họ và tên *</span><input name="fullName" value={form.fullName} onChange={update} required minLength="2" autoComplete="name" /></label>
        <label className="field"><span>Số điện thoại *</span><input type="tel" name="phone" value={form.phone} onChange={update} onBlur={validateField} onInvalid={validateField} required pattern={vnPhoneRegex.source} autoComplete="tel" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'booking-phone-error' : undefined} />{fieldErrors.phone && <small id="booking-phone-error" className="field-error" role="alert">{fieldErrors.phone}</small>}</label>
        <label className="field field--wide"><span>Email *</span><input type="email" name="email" value={form.email} onChange={update} onBlur={validateField} onInvalid={validateField} required maxLength={190} autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'booking-email-error' : undefined} />{fieldErrors.email && <small id="booking-email-error" className="field-error" role="alert">{fieldErrors.email}</small>}</label>
        <label className="field"><span>Số người</span><select name="participants" value={form.participants} onChange={update}>{[1,2,3,4].map((n) => <option key={n} value={n}>{n} người</option>)}</select></label>
        <label className="field field--wide"><span>Lời nhắn</span><textarea name="note" value={form.note} onChange={update} rows="3" placeholder="Điều Họa Lụa cần biết để chuẩn bị tốt hơn..." /></label>
      </div>
      <label className="consent"><input type="checkbox" required /> <span>Tôi đồng ý để Họa Lụa sử dụng thông tin trên nhằm xác nhận đăng ký.</span></label>
      {state.error && <p className="form-message form-message--error" role="alert">{state.error}</p>}
      {state.success && <p className="form-message form-message--success" role="status">{state.success}</p>}
      <button className="button" disabled={state.loading}>{state.loading ? 'Đang gửi…' : 'Hoàn tất đăng ký'} <span aria-hidden="true">→</span></button>
    </form>
  );
}

export default BookingForm;
