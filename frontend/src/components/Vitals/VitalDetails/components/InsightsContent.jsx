import { Brain, Zap, TrendingUp, Target, Lightbulb, Clock, Users, Award, ShieldCheck } from 'lucide-react';

const InsightsContent = ({ aiAnalysis, getAIAnalysis }) => {
  const recommendations = aiAnalysis?.aiRecommendations || {};
  
  const ensureStrings = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        return item.text || item.message || item.english || JSON.stringify(item);
      }
      return String(item);
    });
  };

  const sections = [
    { label: 'Priority Actions', icon: Zap, color: 'amber', items: ensureStrings(recommendations.immediateActions) || ['Initial health assessment recommended'] },
    { label: 'Lifestyle', icon: TrendingUp, color: 'emerald', items: ensureStrings(recommendations.lifestyleChanges) || ['Balanced nutrition and hydration'] },
    { label: 'Medical Advice', icon: Users, color: 'blue', items: ensureStrings(recommendations.medicalConsultation) || ['Routine follow-up scheduled'] },
    { label: 'Tracking', icon: Target, color: 'indigo', items: ensureStrings(recommendations.monitoringSuggestions) || ['Daily vital signs tracking'] }
  ];

  return (
    <div className="standard-card p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg ">
          <Brain size={20} />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">AI Summary</h3>
      </div>
      
      {aiAnalysis ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => (
            <div key={idx} className={`bg-${section.color}-50/50 rounded-2xl p-6 border border-${section.color}-100`}>
               <div className="flex items-center gap-3 mb-6">
                  <section.icon size={18} className={`text-${section.color}-600`} />
                  <h4 className={`text-[10px] font-black text-${section.color}-800 uppercase tracking-widest`}>{section.label}</h4>
               </div>
               <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                       <div className={`w-1.5 h-1.5 rounded-full bg-${section.color}-500 mt-1.5 shrink-0`} />
                       <span className="text-[11px] font-bold text-slate-700 leading-snug">{item}</span>
                    </li>
                  ))}
               </ul>
            </div>
          ))}
          
          <div className="md:col-span-2 bg-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
             
             <div className="flex items-center gap-4 mb-4">
                <ShieldCheck className="text-emerald-500" size={24} />
                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Protocol Metadata</h4>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Evaluation Date</p>
                   <p className="text-xs font-bold">{new Date(aiAnalysis.aiMetadata?.analyzedAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Analysis Mode</p>
                   <p className="text-xs font-bold text-emerald-500">Premium</p>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center gap-4 opacity-50">
          <Brain size={40} className="text-slate-300" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analysis Pending</p>
        </div>
      )}
    </div>
  );
};

export default InsightsContent;