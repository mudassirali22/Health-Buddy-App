import { AlertTriangle } from 'lucide-react';

const AnalysisError = ({ aiError }) => {
  return (
    <div className="bg-amber-100 backdrop-blur-sm border border-amber-300 rounded-3xl p-6 mb-8">
      <div className="flex items-center gap-4">
        <AlertTriangle className="w-8 h-8 text-amber-600" />
        <div>
          <h3 className="text-xl font-semibold text-amber-700">Analysis Notice</h3>
          <p className="text-amber-600">{aiError}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisError;