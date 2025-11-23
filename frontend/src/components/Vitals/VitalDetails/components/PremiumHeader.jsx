import { ArrowLeft, BrainCircuit, Calendar, Sparkle, Loader } from 'lucide-react';

const PremiumHeader = ({ navigate, vital, formatDate, getAIAnalysis, aiLoading }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
      {/* Header */}
      <div className="flex  flex-col gap-4 mb-4 lg:mb-0">
        <button
          onClick={() => navigate('/vitals')}
          className="group bg-emerald-500 w-30 cursor-pointer hover:bg-emerald-600 text-white px-4 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
        >
          <ArrowLeft className="w-5 h-5  group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-15 h-15 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl  md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent animate-gradient">
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
          className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-3 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 disabled:opacity-50"
        >
          {aiLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Generate Deep Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PremiumHeader;