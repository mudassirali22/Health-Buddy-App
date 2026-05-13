import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Brain,
  Activity,
  Hash,
  User,
  Users
} from 'lucide-react';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loginWithMR, register } = useAuth();

  const [isLogin, setIsLogin] = useState(location.state?.isLogin !== undefined ? location.state.isLogin : true);
  const [isVisible, setIsVisible] = useState(false);

  // Login States
  const [loginMode, setLoginMode] = useState('email'); // 'email' or 'mr'
  const [loginData, setLoginData] = useState({ email: '', password: '', mrNumber: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register States
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (location.state?.isLogin !== undefined) {
      setIsLogin(location.state.isLogin);
    }
  }, [location.state]);

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    let result = loginMode === 'email'
      ? await login(loginData.email, loginData.password)
      : await loginWithMR(loginData.mrNumber, loginData.password);
    setLoginLoading(false);
    if (result.success) navigate('/dashboard');
    else setLoginError(result.message);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    setRegisterLoading(true);
    const result = await register(registerData.name, registerData.email, registerData.password);
    setRegisterLoading(false);
    if (result.success) navigate('/dashboard');
    else setRegisterError(result.message);
  };

  return (
    <div className="min-h-screen bg-white flex selection:bg-emerald-100 overflow-hidden relative font-sans">

      <div className={`w-full flex flex-col lg:flex-row transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

        {/* Left Side: Branding */}
        <div className="hidden lg:flex lg:w-[40%] bg-[#0a1a1f] relative overflow-hidden transition-all duration-1000">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

          <div className="relative z-10 pl-15 pt-5 flex flex-col justify-between w-full h-full">
            <div>
              <NavLink to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-md  group-hover:scale-105 transition-transform duration-500">
                  <Heart size={24} fill="currentColor" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-white tracking-tighter leading-none uppercase">HealthBuddy</h1>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mt-1 block">Clinical AI Platform</span>
                </div>
              </NavLink>

              <div className="mt-8 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-6xl font-black text-white leading-[1.05] tracking-tight">
                    Smart Health, <br />
                    <span className="text-emerald-500">Made Easy.</span>
                  </h2>
                  <p className="text-slate-400 text-lg font-medium max-w-sm leading-relaxed">
                    The advanced Clinical AI dashboard for monitoring your health and managing reports.
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    { icon: <Brain />, title: "AI Analysis", desc: "Instant insights from reports" },
                    { icon: <Activity />, title: "Live Tracking", desc: "Monitor vitals in real-time" },
                    { icon: <Users />, title: "Family Sync", desc: "Manage your loved ones easily" }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                        {React.cloneElement(feature.icon, { size: 20 })}
                      </div>
                      <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-wider mb-1">{feature.title}</h4>
                        <p className="text-slate-500 text-xs font-medium">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto opacity-50 mb-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                © 2026 HealthBuddy Clinical AI
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="w-full lg:w-[60%] relative flex flex-col bg-white overflow-hidden">

          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:py-10 lg:px-16 overflow-y-auto custom-scrollbar">

            <div className="w-full max-w-md">
              {/* Login / Sign Up Toggle */}
              <div className="mb-8">
                <div className="relative flex bg-emerald-50 border border-slate-100 rounded-[2rem] p-1 shadow-inner h-14">
                  <div
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white border border-slate-100 rounded-[1.75rem] shadow-md transition-all duration-500 cubic-bezier z-0"
                    style={{ left: isLogin ? '4px' : 'calc(50%)' }}
                  />
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`relative z-10 flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isLogin ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`relative z-10 flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${!isLogin ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden min-h-[500px]">
                <div
                  className="flex transition-all duration-700 ease-in-out"
                  style={{ transform: `translateX(${isLogin ? '0%' : '-50%'})`, width: '200%' }}
                >
                  {/* LOGIN FORM SECTION */}
                  <div className={`w-1/2 px-1 transition-opacity duration-500 ${isLogin ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="mb-8">
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Welcome Back</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Please login to your account</p>
                    </div>

                    {/* Email / Medical ID Toggle */}
                    <div className="relative flex bg-emerald-50 border border-slate-100 rounded-2xl p-1 mb-6 h-12">
                      <div
                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white border border-slate-100 rounded-xl shadow-sm transition-all duration-500 cubic-bezier z-0"
                        style={{ left: loginMode === 'email' ? '4px' : 'calc(50%)' }}
                      />
                      <button
                        onClick={() => setLoginMode('email')}
                        className={`relative z-10 flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors ${loginMode === 'email' ? 'text-emerald-600' : 'text-slate-400'}`}
                      >
                        Email
                      </button>
                      <button
                        onClick={() => setLoginMode('mr')}
                        className={`relative z-10 flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors ${loginMode === 'mr' ? 'text-emerald-600' : 'text-slate-400'}`}
                      >
                        Medical ID
                      </button>
                    </div>

                    {loginError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-[1.25rem] flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                        <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-black text-[10px]">!</div>
                        <p className="text-red-600 text-[10px] font-bold">{loginError}</p>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="space-y-4">
                        {loginMode === 'email' ? (
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                              <input
                                name="email"
                                type="email"
                                required
                                placeholder="name@email.com"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-200 transition-all text-sm font-medium"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Medical ID</label>
                            <div className="relative group">
                              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                              <input
                                name="mrNumber"
                                type="text"
                                required
                                placeholder="HB-XXXXX"
                                value={loginData.mrNumber}
                                onChange={handleLoginChange}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-200 transition-all text-sm font-black tracking-widest uppercase"
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center ml-1 px-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                            <NavLink to="/forgot-password" size={18} className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em] hover:text-emerald-700">Forgot?</NavLink>
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                            <input
                              name="password"
                              type={showLoginPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={loginData.password}
                              onChange={handleLoginChange}
                              className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-200 transition-all text-sm font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                            >
                              {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-emerald-600 text-white py-4.5 rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-md hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group mt-4"
                      >
                        {loginLoading ? <div className="flex items-center gap-3"><div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> <span>Authenticating...</span></div> : <>Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                      </button>
                    </form>
                  </div>

                  {/* SIGN UP FORM SECTION */}
                  <div className={`w-1/2 px-1 transition-opacity duration-500 ${!isLogin ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="mb-8">
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Create Account</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sign up to track your health</p>
                    </div>

                    {registerError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-[1.25rem] flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                        <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-black text-[10px]">!</div>
                        <p className="text-red-600 text-[10px] font-bold">{registerError}</p>
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                          <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                            <input
                              name="name"
                              type="text"
                              required
                              placeholder="Enter your name"
                              value={registerData.name}
                              onChange={handleRegisterChange}
                              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-200 transition-all text-sm font-medium"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                            <input
                              name="email"
                              type="email"
                              required
                              placeholder="name@email.com"
                              value={registerData.email}
                              onChange={handleRegisterChange}
                              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-200 transition-all text-sm font-medium"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                          <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                            <input
                              name="password"
                              type={showRegisterPassword ? 'text' : 'password'}
                              required
                              placeholder="Create password"
                              value={registerData.password}
                              onChange={handleRegisterChange}
                              className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-200 transition-all text-sm font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                            >
                              {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                          <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                            <input
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              placeholder="Confirm password"
                              value={registerData.confirmPassword}
                              onChange={handleRegisterChange}
                              className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-200 transition-all text-sm font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={registerLoading}
                        className="w-full bg-emerald-600 text-white py-4.5 rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-md hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group mt-4"
                      >
                        {registerLoading ? <div className="flex items-center gap-3"><div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> <span>Creating Account...</span></div> : <>Sign Up <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-relaxed">
                  HealthBuddy Platform <br />
                  <span className="text-slate-500 hover:text-emerald-600 cursor-pointer transition-colors">Privacy Policy</span> & <span className="text-slate-500 hover:text-emerald-600 cursor-pointer transition-colors">User Terms</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .cubic-bezier { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
      `}} />
    </div>
  );
};

export default Auth;
