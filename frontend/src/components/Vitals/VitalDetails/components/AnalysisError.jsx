import { AlertTriangle, RotateCw, Info } from 'lucide-react';

const AnalysisError = ({ aiError }) => {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 relative overflow-hidden">
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Diagnostic Engine Notice</h3>
          <p className="text-sm font-bold text-amber-900">{aiError || "The AI analysis service is temporarily recalibrating. Basic clinical norms are being applied as a baseline."}</p>
          <div className="pt-2 flex items-center gap-2">
             <Info size={14} className="text-amber-500" />
             <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Manual review of biometric markers is recommended.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisError;