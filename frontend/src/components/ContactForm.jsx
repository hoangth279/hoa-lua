import { useState } from 'react';
import api from '../api/axios';

function ContactForm() {
  const [form, setForm] = useState({ fullName: '', email: '', subject: '', message: '' });
  const [state, setState] = useState({ loading: false, message: '', error: false });
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setState({ loading: true, message: '', error: false });
    try { const { data } = await api.post('/contacts', form); setState({ loading: false, message: data.message, error: false }); setForm({ fullName: '', email: '', subject: '', message: '' }); }
    catch (error) { setState({ loading: false, message: error.response?.data?.message || 'Chưa thể gửi lời nhắn. Vui lòng thử lại.', error: true }); }
  };
  return <form className="contact-form" onSubmit={submit}>
    <div className="contact-form__intro"><p className="section-index">Một lời nhắn gửi</p><h2>Chia sẻ điều bạn đang nghĩ</h2><p>Để lại thông tin và câu chuyện của bạn để Họa Lụa có thể kết nối.</p></div>
    <label className="field"><span>Họ và tên *</span><input name="fullName" autoComplete="name" placeholder="Tên của bạn" value={form.fullName} onChange={update} required /></label>
    <label className="field"><span>Email *</span><input type="email" name="email" autoComplete="email" placeholder="Email để chúng tôi liên hệ lại" value={form.email} onChange={update} required /></label>
    <label className="field"><span>Chủ đề *</span><input name="subject" placeholder="Bạn muốn trò chuyện về điều gì?" value={form.subject} onChange={update} required /></label>
    <label className="field"><span>Lời nhắn *</span><textarea name="message" placeholder="Kể cho Họa Lụa nghe…" value={form.message} onChange={update} required minLength="10" rows="5" /></label>
    {state.message && <p className={`form-message ${state.error ? 'form-message--error' : 'form-message--success'}`} role="status">{state.message}</p>}
    <button className="button" disabled={state.loading}>{state.loading ? 'Đang gửi…' : 'Gửi lời nhắn'}</button>
  </form>;
}
export default ContactForm;
