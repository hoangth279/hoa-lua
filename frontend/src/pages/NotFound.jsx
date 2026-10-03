import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
function NotFound() { return <div className="not-found container"><Seo title="Không tìm thấy trang" description="Trang bạn tìm không tồn tại hoặc đã được chuyển sang một nơi khác." noIndex/><p className="eyebrow">Lạc một sợi chỉ</p><h1>404</h1><p>Trang bạn tìm không còn ở đây hoặc đã được chuyển sang một nơi khác.</p><Link className="button" to="/">Về trang chủ →</Link></div>; }
export default NotFound;
