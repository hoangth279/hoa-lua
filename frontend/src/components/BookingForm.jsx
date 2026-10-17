import { useState } from 'react';
import api from '../api/axios';
import WorkshopTitle from './WorkshopTitle';
import { validateBookingContact, vnPhoneRegex } from '../utils/bookingValidation';
import { formatPrice } from '../data/content';
import './booking-form.css';

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
    <div className="form-card booking-card">
      <aside className="form-card__intro booking-summary" aria-label="Workshop bạn đã chọn">
        <p className="eyebrow">Trải nghiệm bạn đã chọn</p>
        {workshop.coverImage && <img className="booking-summary__image" src={workshop.coverImage} alt="" loading="lazy" />}
        <WorkshopTitle as="h2" title={workshop.title} />
        <dl className="booking-details">
          <div><dt>Ngày diễn ra</dt><dd>{workshop.date}</dd></div>
          <div><dt>Thời gian</dt><dd>{workshop.time}</dd></div>
          <div><dt>Địa điểm</dt><dd>{workshop.location}</dd></div>
          {workshop.price != null && <div><dt>Phí tham dự</dt><dd>{formatPrice(workshop.price)}{Number(workshop.price) > 0 && <span> / người</span>}</dd></div>}
        </dl>
        <p className="booking-summary__hint">Bạn muốn đổi trải nghiệm? Chọn workshop khác ở danh sách phía trên.</p>
      </aside>
      <form className="booking-form" onSubmit={submit} aria-busy={state.loading}>
        <header className="booking-form__heading"><p className="section-index">Đăng ký tham dự</p><h3>Hẹn bạn tại Họa Lụa</h3><p>Điền thông tin bên dưới để chúng tôi liên hệ xác nhận với bạn.</p></header>
        <p className="booking-form__required">Các mục có dấu <span aria-hidden="true">*</span> là bắt buộc.</p>
        <fieldset className="booking-form__fields" disabled={state.loading}>
        <legend className="sr-only">Thông tin đăng ký</legend>
      <div className="field-grid">
        <label className="field"><span>Họ và tên *</span><input name="fullName" placeholder="Tên của bạn" value={form.fullName} onChange={update} required minLength="2" autoComplete="name" /></label>
        <label className="field"><span>Số điện thoại *</span><input type="tel" name="phone" placeholder="0912345678" inputMode="tel" value={form.phone} onChange={update} onBlur={validateField} onInvalid={validateField} required pattern={vnPhoneRegex.source} autoComplete="tel" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'booking-phone-error' : undefined} />{fieldErrors.phone && <small id="booking-phone-error" className="field-error" role="alert">{fieldErrors.phone}</small>}</label>
        <label className="field field--wide"><span>Email *</span><input type="email" name="email" placeholder="ban@example.com" value={form.email} onChange={update} onBlur={validateField} onInvalid={validateField} required maxLength={190} autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'booking-email-error' : 'booking-email-hint'} />{fieldErrors.email ? <small id="booking-email-error" className="field-error" role="alert">{fieldErrors.email}</small> : <small id="booking-email-hint" className="booking-field-hint">Email để Họa Lụa liên hệ về đăng ký của bạn.</small>}</label>
        <label className="field"><span>Số người</span><select name="participants" value={form.participants} onChange={update}>{[1,2,3,4].map((n) => <option key={n} value={n}>{n} người</option>)}</select></label>
        <label className="field field--wide"><span>Lời nhắn <small>(không bắt buộc)</small></span><textarea name="note" value={form.note} onChange={update} rows="3" placeholder="Bạn có mong muốn hoặc cần hỗ trợ điều gì không?" /></label>
      </div>
      <label className="consent"><input type="checkbox" required /> <span>Tôi đồng ý để Họa Lụa sử dụng thông tin trên nhằm liên hệ và xác nhận đăng&nbsp;ký.</span></label>
      {state.error && <p className="form-message form-message--error" role="alert">{state.error}</p>}
      {state.success && <p className="form-message form-message--success" role="status">{state.success}</p>}
      <button className="button booking-form__submit" disabled={state.loading}>{state.loading ? 'Đang gửi đăng ký…' : 'Gửi đăng ký tham dự'}</button>
      </fieldset>
      </form>
    </div>
  );
}

export default BookingForm;
