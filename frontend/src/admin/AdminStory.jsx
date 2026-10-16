import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { usePublicContent } from '../hooks/usePublicContent';
import { PageTitle } from './AdminBookings';

function StoryPostEditor({ post }) {
  const [form, setForm] = useState(post);
  const [state, setState] = useState({ saving: false, error: '', message: '' });
  const submit = async (event) => {
    event.preventDefault();
    setState({ saving: true, error: '', message: '' });
    try {
      const { data } = await api.put(`/admin/story/${encodeURIComponent(post.slug)}`, {
        title: form.title, content: form.content, isPublished: form.isPublished,
      });
      setForm(data.data);
      setState({ saving: false, error: '', message: data.message });
    } catch (error) {
      setState({ saving: false, message: '', error: error.response?.data?.message || 'Không thể lưu mục Câu chuyện. Vui lòng thử lại.' });
    }
  };

  return <form className="admin-story-post" onSubmit={submit}>
    <fieldset disabled={state.saving}>
      <legend>Mục {post.number}</legend>
      <div className="admin-form-grid">
        <label className="is-wide"><span>Tiêu đề mục {post.number} *</span><input required maxLength={255} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></label>
        <label className="is-wide"><span>Nội dung mục {post.number} *</span><textarea required rows={10} maxLength={50000} value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} /></label>
        <p className="admin-story__hint">Ngăn cách các đoạn bằng một dòng trống. Đặt nhãn trước dấu hai chấm để hiển thị nhãn in đậm.</p>
        <label><input type="checkbox" checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} /><span>Xuất bản mục {post.number}</span></label>
      </div>
      {state.error && <p className="admin-alert is-error" role="alert">{state.error}</p>}
      {state.message && <p className="admin-alert is-success" role="status">{state.message}</p>}
      <button className="admin-primary" disabled={state.saving}>{state.saving ? 'Đang lưu…' : `Lưu mục ${post.number}`}</button>
    </fieldset>
  </form>;
}

export default function AdminStory() {
  const { data, loading, error, retry } = usePublicContent('/admin/story');
  const posts = data || [];
  return <>
    <PageTitle title="Câu chuyện Họa Lụa" text="Chỉnh sửa riêng từng mục 01, 02, 03 trên trang Câu chuyện." action={<Link className="admin-primary" to="/gioi-thieu" target="_blank" rel="noreferrer">Xem trên web ↗</Link>} />
    {loading && <div className="admin-loading" role="status">Đang tải Câu chuyện…</div>}
    {error && <div className="admin-alert is-error" role="alert"><p>{error}</p><button className="admin-primary" onClick={retry}>Thử lại</button></div>}
    {!loading && !error && !posts.length && <p className="admin-empty">Chưa có các mục Câu chuyện.</p>}
    <div className="admin-story">{posts.map((post) => <StoryPostEditor key={post.id} post={post} />)}</div>
  </>;
}