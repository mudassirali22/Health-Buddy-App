import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, ArrowLeft, Heart } from 'lucide-react';

const PageNotFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-lg  border border-slate-100 overflow-hidden text-center p-12">
          
          <div className="relative mb-8">
            <div className="text-[120px] font-black text-slate-200 leading-none select-none italic tracking-tighter">
              404
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">Page Not Found</h2>
            <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-tight opacity-70">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <NavLink
              to={user ? "/dashboard" : "/"}
              className="flex items-center justify-center bg-slate-800 text-white px-8 py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-md  font-black text-[10px] uppercase tracking-widest group"
            >
              <Home className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform text-emerald-400" />
              {user ? "Back to Dashboard" : "Go to Homepage"}
            </NavLink>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-full text-slate-400 hover:text-slate-800 px-8 py-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest group"
            >
              <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
              Return to Previous Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;