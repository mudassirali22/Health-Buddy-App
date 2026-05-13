import { Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';

const HealthInsightsFooter = ({ stats }) => {
  return (
    <div className="standard-card p-8 overflow-hidden relative">
      
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg ">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Health Insights Summary</h3>
          </div>
          
          <div className="space-y-4">
             <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
                <ShieldCheck size={20} className="text-emerald-500" />
                <p className="text-sm font-medium text-slate-600">
                  Your aggregated health score index is <span className="font-black text-slate-800">{stats.avgHealthScore}</span>
                </p>
             </div>
             <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
                <Activity size={20} className="text-blue-500" />
                <p className="text-sm font-medium text-slate-600">
                  Monitoring <span className="font-black text-slate-800">{stats.totalRecords} observations</span> across {stats.totalMetrics} biomarkers.
                </p>
             </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
          
          <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Status Distribution</h4>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(stats.statusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${
                     status === 'Excellent' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                     status === 'Good' ? 'bg-green-400' :
                     status === 'Fair' ? 'bg-amber-400' :
                     status === 'Needs Attention' ? 'bg-orange-400' : 'bg-red-400'
                   }`}></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{status}</span>
                </div>
                <span className="text-sm font-black text-white">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified History</span>
             <Sparkles size={16} className="text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInsightsFooter;