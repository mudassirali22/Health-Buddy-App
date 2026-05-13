import { CheckCircle, Activity, Calendar, Target, Clock, Star, Award, ShieldCheck } from 'lucide-react';

const ActionsContent = ({ aiAnalysis }) => {
  const recommendations = aiAnalysis?.aiRecommendations || {};
  
  const timeline = [
    { period: 'Immediate', tasks: recommendations.immediateActions?.slice(0, 2) || ['Verify baseline data'] },
    { period: '1-4 Weeks', tasks: recommendations.lifestyleChanges?.slice(0, 2) || ['Implement diet delta'] },
    { period: '1-3 Months', tasks: ['Assess progress trajectory', 'Protocol adjustment'] },
    { period: 'Ongoing', tasks: recommendations.monitoringSuggestions?.slice(0, 2) || ['Continuous tracking'] }
  ];

  return (
    <div className="standard-card p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg ">
          <CheckCircle size={20} />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Action Plan</h3>
      </div>
      
      {aiAnalysis ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {timeline.map((phase, idx) => (
                <div key={idx} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                   <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[9px] font-black">
                         {idx + 1}
                      </div>
                      <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{phase.period}</h4>
                   </div>
                   <ul className="space-y-2">
                      {phase.tasks.map((task, i) => (
                        <li key={i} className="text-[10px] font-bold text-slate-500 leading-snug flex items-start gap-2">
                           <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 shrink-0" />
                           {task}
                        </li>
                      ))}
                   </ul>
                </div>
             ))}
          </div>

          <div className="bg-slate-800 rounded-[2rem] p-8 text-white relative overflow-hidden">
             
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="space-y-2">
                   <div className="flex items-center gap-3 mb-2">
                      <Target className="text-emerald-500" size={24} />
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Health Goals</h4>
                   </div>
                   <p className="text-sm font-medium text-slate-300 max-w-md">
                      Consistent implementation of this clinical protocol is essential for long-term physiological stability.
                   </p>
                </div>
                <div className="flex gap-4">
                   {[
                     { label: 'Daily', val: 'Vitals' },
                     { label: 'Weekly', val: 'Review' },
                     { label: 'Monthly', val: 'Assessment' }
                   ].map(item => (
                     <div key={item.label} className="px-4 py-3 bg-white/5 rounded-xl border border-white/5 text-center min-w-[100px]">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-xs font-black">{item.val}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center gap-4 opacity-50">
          <CheckCircle size={40} className="text-slate-300" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Generation Pending</p>
        </div>
      )}
    </div>
  );
};

export default ActionsContent;