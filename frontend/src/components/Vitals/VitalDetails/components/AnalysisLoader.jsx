import { Brain, RotateCw, ShieldCheck } from 'lucide-react';

const AnalysisLoader = () => {
  return (
    <div className="standard-card p-12 mb-8 relative overflow-hidden bg-white border-slate-200">

      <div className="relative z-10 flex flex-col items-center text-center space-y-8">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Main spinning ring */}
          <div className="absolute inset-0 border-[3px] border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin"></div>
          
          {/* Brain with internal loader */}
          <div className="relative w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Brain size={24} />
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
               <RotateCw size={32} className="animate-spin text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">AI diagnostic in progress</h3>
          <p className="text-slate-400 text-[8px] font-black max-w-xs mx-auto leading-relaxed uppercase tracking-widest opacity-70">
            Aggregating biometric markers and cross-referencing with clinical baselines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoader;
