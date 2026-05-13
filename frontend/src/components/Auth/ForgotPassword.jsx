import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, XCircle, Shield, Clock, Heart, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        setMessage(response.data.message);
        setEmail('');
        setCountdown(60);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message ||  'An error occurred. Please try again.';
                         
      setError(errorMessage);
      
      if (err.response?.status === 429) {
        setCountdown(300);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

   return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-6 selection:bg-emerald-100">
         {/* Subtle Background Elements */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-50/50 rounded-full" />
            <div className="absolute bottom-[20%] -left-[10%] w-[30%] h-[30%] bg-slate-50/50 rounded-full" />
         </div>

         <div className={`w-full max-w-md mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logo */}
            <NavLink to="/" className="flex flex-col items-center gap-2 mb-12 group">
               <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-md  group-hover:scale-105 transition-transform">
                  <Heart size={24} fill="currentColor" />
               </div>
               <div className="text-center">
                  <h1 className="text-2xl font-black text-slate-800 tracking-tighter leading-none">HealthBuddy</h1>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Recovery Access</p>
               </div>
            </NavLink>

            {/* Reset Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
               <div className="relative z-10">
                  <div className="mb-10 text-center">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Reset Access</h2>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Restore your secure account</p>
                  </div>

                  {message && (
                     <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                        <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-black text-xs">✓</div>
                        <p className="text-emerald-700 text-xs font-bold leading-tight">{message}</p>
                     </div>
                  )}

                  {error && (
                     <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-black text-xs">!</div>
                        <p className="text-red-600 text-xs font-bold leading-tight">{error}</p>
                     </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
                        <div className="relative">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           <input
                              type="email"
                              required
                              placeholder="name@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={loading || countdown > 0}
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-sm font-medium disabled:opacity-50"
                           />
                        </div>
                     </div>

                     <button
                        type="submit"
                        disabled={loading || countdown > 0 || !email}
                        className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-md  hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                     >
                        {loading ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : countdown > 0 ? (
                           <>{formatTime(countdown)}</>
                        ) : (
                           <>Send Reset Link <ArrowRight size={16} /></>
                        )}
                     </button>
                  </form>
               </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center">
               <NavLink to="/auth" state={{ isLogin: true }} className="inline-flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                  <ArrowLeft size={14} /> Back to Sign In
               </NavLink>
            </div>
         </div>
      </div>
   );
};

export default ForgotPassword;