export default function ContentState({ loading, error, empty, onRetry }) {
  if (loading) return <p className="content-state" role="status">Đang tải nội dung…</p>;
  if (error) return <div className="content-state" role="alert"><p>{error}</p><button className="button button--small" onClick={onRetry}>Thử lại</button></div>;
  return empty ? <p className="content-state">{empty}</p> : null;
}
