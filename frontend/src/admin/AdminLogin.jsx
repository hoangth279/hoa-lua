import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAdminAuth } from './adminAuthContext';
import logo from '../assets/logo.jpg';

function AdminLogin() {
  const { user, checking, setUser } = useAdminAuth(); const navigate=useNavigate(); const location=useLocation();
  const [form,setForm]=useState({email:'',password:''}); const [state,setState]=useState({loading:false,error:''});
  if (!checking && user) return <Navigate to="/admin" replace />;
  const submit=async(event)=>{event.preventDefault();setState({loading:true,error:''});try{const {data}=await api.post('/admin/auth/login',form);setUser(data.data);navigate(location.state?.from||'/admin',{replace:true});}catch(error){setState({loading:false,error:error.response?.data?.message||'Không thể đăng nhập lúc này.'});}};
  return <div className="admin-login"><div className="admin-login__art"><div><p>Không gian quản trị</p><h1>Giữ từng câu chuyện<br/>được kể <em>đúng cách.</em></h1><span>Họa Lụa · Nghệ thuật được sẻ chia</span></div></div><div className="admin-login__panel"><form onSubmit={submit}><img src={logo} alt="Họa Lụa"/><p className="admin-kicker">Dành cho quản trị viên</p><h2>Chào mừng trở lại.</h2><p>Đăng nhập để quản lý nội dung và hoạt động của Họa Lụa.</p><label><span>Email</span><input type="email" required autoComplete="username" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/></label><label><span>Mật khẩu</span><input type="password" required minLength="6" autoComplete="current-password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/></label>{state.error&&<div className="admin-alert is-error" role="alert">{state.error}</div>}<button className="admin-primary" disabled={state.loading}>{state.loading?'Đang đăng nhập…':'Đăng nhập →'}</button><a href="/">← Trở về website</a></form></div></div>;
}
export default AdminLogin;
