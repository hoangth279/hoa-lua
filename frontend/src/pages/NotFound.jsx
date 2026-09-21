import { Link } from 'react-router-dom';
function NotFound() { return <div className="not-found container"><p className="eyebrow">Lạc một sợi chỉ</p><h1>404</h1><p>Trang bạn tìm không còn ở đây hoặc đã được chuyển sang một nơi khác.</p><Link className="button" to="/">Về trang chủ →</Link></div>; }
export default NotFound;
