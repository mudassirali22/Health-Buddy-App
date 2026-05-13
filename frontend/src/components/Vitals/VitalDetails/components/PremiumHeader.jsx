import { ArrowLeft, BrainCircuit, Calendar, Sparkle, Loader } from 'lucide-react';

const PremiumHeader = ({ navigate, vital, formatDate, getAIAnalysis, aiLoading }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
      {/* Header */}
      <div className="flex  flex-col gap-4 mb-4 lg:mb-0">
        <button
          onClick={() => navigate('/vitals')}
          className="group bg-emerald-600 w-30 cursor-pointer hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300"
        >
          Back
        </button>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-600">
              Health Intelligence
            </h1>
            <p className="text-gray-600 flex items-center gap-2 mt-2">
              <Calendar className="w-4 h-4" />
              {formatDate(vital.date).slice(0,17)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={getAIAnalysis}
          disabled={aiLoading}
          className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-md disabled:opacity-50"
        >
          {aiLoading ? (
            <span>Analyzing...</span>
          ) : (
            <span>Generate Deep Analysis</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default PremiumHeader;