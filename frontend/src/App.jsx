import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Activities from './pages/Activities';
import Workshops from './pages/Workshops';
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import ArticleDetail from './pages/ArticleDetail';
import Contact from './pages/Contact';
import AdminStory from './admin/AdminStory';
import { AdminAuthProvider, AdminGuard } from './admin/AdminAuth';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminBookings from './admin/AdminBookings';
import AdminContacts from './admin/AdminContacts';
import AdminResource from './admin/AdminResource';
import AdminSettings from './admin/AdminSettings';
import './admin/admin.css';

function App() {
    return (
        <BrowserRouter>
          <ScrollToTop />
          <AdminAuthProvider>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/gioi-thieu" element={<About />} />
                    <Route path="/hoat-dong" element={<Activities />} />
                    <Route path="/workshop" element={<Workshops />} />
                    <Route path="/ve-chung-toi" element={<AboutUs />} />
                    <Route path="/thu-vien" element={<Gallery />} />
                    <Route path="/thu-vien/:slug" element={<ArticleDetail />} />
                    <Route path="/lien-he" element={<Contact />} />
                    <Route path="/bai-viet" element={<Navigate to="/gioi-thieu" replace />} />
                    <Route path="/bai-viet/:slug" element={<Navigate to="/gioi-thieu" replace />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/admin/dang-nhap" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="lien-he" element={<AdminContacts />} />
                    <Route path="workshops" element={<AdminResource key="workshops" resource="workshops" />} />
                    <Route path="campaigns" element={<AdminResource key="campaigns" resource="campaigns" />} />
                    <Route path="cau-chuyen" element={<AdminStory />} />
                    <Route path="bai-viet" element={<Navigate to="/admin/cau-chuyen" replace />} />
                    <Route path="thong-tin-huu-ich" element={<AdminResource key="articles" resource="articles" />} />
                    <Route path="gallery" element={<AdminResource key="gallery" resource="gallery" />} />
                    <Route path="cau-hinh" element={<AdminSettings />} />
                  </Route>
                </Route>
            </Routes>
          </AdminAuthProvider>
        </BrowserRouter>
    );
}

export default App;
