import { Bot, Flag, AlertTriangle, XCircle } from 'lucide-react';

const AnalysisTab = ({ aiSummary }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
          <Bot className="text-green-600 text-xl" />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">AI Health Analysis</h2>
          <p className="text-gray-600 text-sm sm:text-md">Comprehensive analysis of your medical report</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Flag className="text-blue-600 w-4 h-4" />
          </div>
          English Summary
        </h3>
        <p className="text-gray-700 leading-relaxed  bg-white rounded-xl p-4 border border-blue-100">
          {aiSummary.english}
        </p>
      </div>

      {aiSummary.abnormalValues?.length > 0 && (
        <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
          <h3 className="font-semibold text-red-900 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-red-600 w-4 h-4" />
            </div>
            Abnormal Values Found
          </h3>
          <div className="grid gap-3">
            {aiSummary.abnormalValues.map((value, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-red-100">
                <XCircle className="text-red-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-red-800 text-md">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisTab;