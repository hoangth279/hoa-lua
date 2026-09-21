import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Activities from './pages/Activities';
import Workshops from './pages/Workshops';
import News from './pages/News';
import PostDetail from './pages/PostDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
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
          <AdminAuthProvider>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/gioi-thieu" element={<About />} />
                    <Route path="/hoat-dong" element={<Activities />} />
                    <Route path="/workshop" element={<Workshops />} />
                    <Route path="/tin-tuc" element={<News />} />
                    <Route path="/tin-tuc/:slug" element={<PostDetail />} />
                    <Route path="/thu-vien" element={<Gallery />} />
                    <Route path="/lien-he" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/admin/dang-nhap" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="lien-he" element={<AdminContacts />} />
                    <Route path="workshops" element={<AdminResource resource="workshops" />} />
                    <Route path="campaigns" element={<AdminResource resource="campaigns" />} />
                    <Route path="bai-viet" element={<AdminResource resource="posts" />} />
                    <Route path="gallery" element={<AdminResource resource="gallery" />} />
                    <Route path="cau-hinh" element={<AdminSettings />} />
                  </Route>
                </Route>
            </Routes>
          </AdminAuthProvider>
        </BrowserRouter>
    );
}

export default App;
