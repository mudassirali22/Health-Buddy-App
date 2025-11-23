import { Brain } from 'lucide-react';

const AnalysisLoader = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-8 border border-emerald-200">
      <div className="text-center">
        <div className="relative inline-block mb-6">
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="w-16 h-16 border-4 border-green-400 border-b-transparent rounded-full animate-spin animate-reverse absolute top-2 left-1/2 -translate-x-1/2"></div>
          <Brain className="absolute inset-0 m-auto w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          AI Analysis in Progress
        </h3>
        <p className="text-gray-600 text-lg">Processing advanced health algorithms...</p>
        <div className="mt-6 flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoader;
