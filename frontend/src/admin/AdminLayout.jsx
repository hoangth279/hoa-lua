import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './adminAuthContext';
import logo from '../assets/logo.jpg';

const navigation = [
  ['/admin', 'Tổng quan', '⌂'],
  ['/admin/bookings', 'Booking', '◷'],
  ['/admin/lien-he', 'Liên hệ', '✉'],
  ['/admin/workshops', 'Workshop', '◫'],
  ['/admin/campaigns', 'Campaign', '◎'],
  ['/admin/bai-viet', 'Bài viết', '≡'],
  ['/admin/gallery', 'Thư viện', '▧'],
  ['/admin/cau-hinh', 'Cấu hình', '⚙'],
];

function AdminLayout() {
  const [open, setOpen] = useState(false); const { user, logout } = useAdminAuth(); const navigate = useNavigate();
  const signOut = async () => { await logout(); navigate('/admin/dang-nhap', { replace: true }); };
  return <div className="admin-shell">
    <aside className={open ? 'admin-sidebar is-open' : 'admin-sidebar'}>
      <div className="admin-brand"><img src={logo} alt="" /><div><strong>Họa Lụa</strong><span>Quản trị nội dung</span></div></div>
      <nav aria-label="Điều hướng quản trị">{navigation.map(([to,label,icon])=><NavLink key={to} to={to} end={to==='/admin'} onClick={()=>setOpen(false)}><span aria-hidden="true">{icon}</span>{label}</NavLink>)}</nav>
      <a className="admin-view-site" href="/" target="_blank" rel="noreferrer">Xem website ↗</a>
    </aside>
    {open && <button className="admin-overlay" aria-label="Đóng menu" onClick={()=>setOpen(false)} />}
    <div className="admin-main">
      <header className="admin-topbar"><button className="admin-menu" onClick={()=>setOpen(true)} aria-label="Mở menu">☰</button><div className="admin-account"><div><strong>{user?.name}</strong><span>{user?.role === 'super_admin' ? 'Quản trị viên cấp cao' : 'Biên tập viên'}</span></div><button onClick={signOut}>Đăng xuất</button></div></header>
      <main className="admin-content"><Outlet /></main>
    </div>
  </div>;
}
export default AdminLayout;
