import { Award, FileText, Bell, Activity, Target } from 'lucide-react';
import { formatDate } from './dateUtils';

const StatsOverview = ({ stats, vitals }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="standard-card p-6 overflow-hidden relative">
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Average Health Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{stats.avgHealthScore}</span>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Score</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${stats.avgHealthScore}%` }}
              ></div>
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
            <Award size={24} />
          </div>
        </div>
      </div>
      
      <div className="standard-card p-6 overflow-hidden relative">
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Checks</p>
            <div className="flex items-baseline gap-2">
               <span className="text-3xl font-black text-slate-800 tracking-tight">{stats.totalRecords}</span>
               <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Logs</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <FileText size={24} />
          </div>
        </div>
      </div>

      <div className="standard-card p-6 overflow-hidden relative">
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Last Checked</p>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-black text-slate-800 tracking-tight">
                 {formatDate(vitals[0].date).split(',')[0]}
               </span>
            </div>
            <p className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em] mt-2">Recent Activity</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
            <Activity size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;