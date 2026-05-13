import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-md  text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-8 shadow-inner">
        <Heart size={48} className="animate-pulse" />
      </div>
      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-3">
        No Vitals Found
      </h3>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10 max-w-xs opacity-70 leading-relaxed">
        Track your vital signs and get AI-powered health insights to optimize your wellbeing
      </p>
      <Link
        to="/add-vitals"
        className="hover:bg-emerald-700 cursor-pointer   bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md  active:scale-95 flex items-center gap-2"
      >
        <Plus className="w-6 h-6" />
        Record Your First Vitals
      </Link>
    </div>
  );
};

export default EmptyState;