import { useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { AdminAuthContext } from './adminAuthContext';

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.get('/admin/auth/me').then(({ data }) => setUser(data.data)).catch(() => setUser(null)).finally(() => setChecking(false));
  }, []);

  const value = useMemo(() => ({ user, checking, setUser, async logout() { await api.post('/admin/auth/logout'); setUser(null); } }), [user, checking]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function AdminGuard() {
  const { user, checking } = useContext(AdminAuthContext);
  const location = useLocation();
  if (checking) return <div className="admin-loading" role="status">Đang kiểm tra phiên đăng nhập…</div>;
  if (!user) return <Navigate to="/admin/dang-nhap" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
