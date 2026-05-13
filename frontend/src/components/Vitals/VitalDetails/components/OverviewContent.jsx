import {
  Crown, ShieldCheck, Clock, TrendingUpIcon, TargetIcon,
  Lightbulb, BarChart3, Zap, Database, FileText, Heart, Thermometer,
  Scale, Droplets, Brain, Ruler, Eye, Ear, Gauge,
  Stethoscope, Microscope, Syringe, AlertTriangle, CheckCircle,
  AlertCircle, TrendingUp, Target, Calendar, Utensils, Dumbbell,
  Moon, Sun, Activity, Shield, Info, Loader, Sparkles
} from 'lucide-react';

const OverviewContent = ({
  aiAnalysis,
  vital,
  healthMetrics,
  getAIAnalysis,
  getHealthScoreColor,
  getStatusIcon,
  setSelectedMetric
}) => {
  if (!aiAnalysis) {
    return (
      <div className="standard-card py-20 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-sm border border-emerald-100">
          <Brain size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">No Analysis Yet</h3>
        <p className="text-slate-500 text-xs font-medium max-w-md mx-auto mb-8">
          The AI needs your permission to analyze this record. 
          Run a full analysis to see health insights.
        </p>
        <button
          onClick={getAIAnalysis}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-md  transition-all flex items-center gap-3 active:scale-95"
        >
          <Sparkles size={18} /> See AI Analysis
        </button>
      </div>
    );
  }

  const assessment = aiAnalysis.overallAssessment || {};

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-amber-50/50 border-l-4 border-amber-400 p-4 rounded-xl">
         <div className="flex items-start gap-3">
            <Info className="text-amber-600 shrink-0 mt-0.5" size={16} />
            <p className="text-[10px] font-bold text-amber-800 uppercase leading-relaxed tracking-wider">
               <span className="font-black">Note:</span> {aiAnalysis.aiMetadata?.disclaimer || "The AI gives tips, but always ask your doctor for real medical advice."}
            </p>
         </div>
      </div>

      {/* Main Assessment Card */}
      <div className="standard-card p-8 overflow-hidden relative">
        
        
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                   <ShieldCheck size={12} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Checked</span>
                </div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">
                   Health Score: <span className="text-emerald-600">{assessment.score || 75}</span>
                </h2>   
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                   <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <Zap size={14} className="text-emerald-500" />
                      Risk Level: <span className="text-slate-800">{assessment.riskLevel || 'Low'}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <Target size={14} className="text-blue-500" />
                      Priority: <span className="text-slate-800">{assessment.urgency || 'Routine'}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <Clock size={14} className="text-amber-500" />
                      Stability: <span className="text-slate-800">{assessment.stability || 'Stable'}</span>
                   </div>
                </div>
             </div>

             <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-lg relative">
                   <div className="absolute inset-0 bg-emerald-500/10 rounded-[2rem] animate-pulse"></div>
                   {getStatusIcon(assessment.status || 'Good')}
                </div>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{assessment.status || 'Good'}</span>
             </div>
          </div>

          <div className="space-y-3">
             <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${assessment.score || 75}%` }}
                ></div>
             </div>
             <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                "{assessment.summary || "Check completed. Everything looks fine."}"
             </p>
          </div>

          {/* Key Findings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
             {(assessment.keyFindings || ["Normal results", "Everything is stable", "Good progress"]).map((finding, idx) => (
                <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                   <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                      <Lightbulb size={14} />
                   </div>
                   <span className="text-[11px] font-bold text-slate-600 leading-snug">{finding}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Deep Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="standard-card p-6 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <TrendingUp size={16} className="text-emerald-500" /> How you are doing
            </h3>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
               {aiAnalysis.trendInsights || "Your health looks okay."}
            </p>
         </div>
         
         <div className="standard-card p-6 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <AlertCircle size={16} className="text-red-500" /> Important Warnings
            </h3>
            <div className="space-y-2">
               {(aiAnalysis.redFlags || ["No big problems found"]).map((flag, idx) => (
                 <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                    <div className={`w-1.5 h-1.5 rounded-full ${aiAnalysis.redFlags?.length ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {flag}
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default OverviewContent;