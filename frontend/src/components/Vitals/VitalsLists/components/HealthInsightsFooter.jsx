import { Sparkles } from 'lucide-react';

const HealthInsightsFooter = ({ stats }) => {
  return (
    <div className="mt-12 bg-gradient-to-r from-green-500 via-emerald-600 to-blue-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg sm:text-2xl font-bold mb-3 flex items-center gap-3">
              Health Tracking Insights
            </h3>
            <p className="text-green-100 text-md sm:text-lg mb-2">
              Your average health score is <span className="font-bold text-white">{stats.avgHealthScore}</span>
            </p>
            <p className="text-green-100">
              Tracking <span className="font-bold text-white">{stats.totalRecords} records</span> across{' '}
              <span className="font-bold text-white">{stats.totalMetrics} metrics</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">{stats.totalRecords}</div>
              <div className="text-green-100 text-sm">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">{stats.avgHealthScore}</div>
              <div className="text-green-100 text-sm">Avg. Score</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-green-400/30">
          <h4 className="text-md sm:text-lg font-semibold mb-3">Health Status Distribution</h4>
          <div className="flex flex-wrap gap-4">
            {Object.entries(stats.statusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  status === 'Excellent' ? 'bg-emerald-400' :
                  status === 'Good' ? 'bg-green-400' :
                  status === 'Fair' ? 'bg-yellow-400' :
                  status === 'Needs Attention' ? 'bg-orange-400' : 'bg-red-400'
                }`}></div>
                <span className="text-green-100">{status}:</span>
                <span className="font-bold text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInsightsFooter;