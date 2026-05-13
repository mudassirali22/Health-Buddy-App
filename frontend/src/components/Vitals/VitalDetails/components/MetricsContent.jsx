import { BarChart3, Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const MetricsContent = ({ healthMetrics }) => {
  const getRiskIcon = (risk) => {
    const icons = {
      'very-low': <CheckCircle size={14} className="text-emerald-500" />,
      'low': <CheckCircle size={14} className="text-emerald-500" />,
      'medium': <Info size={14} className="text-amber-500" />,
      'high': <AlertTriangle size={14} className="text-red-500" />,
      'critical': <AlertTriangle size={14} className="text-red-500" />,
      'default': <Info size={14} className="text-slate-400" />
    };
    return icons[risk] || icons.default;
  };

  const getRiskTextColor = (risk) => {
    const colors = {
      'very-low': 'text-emerald-600',
      'low': 'text-emerald-600',
      'medium': 'text-amber-600',
      'high': 'text-red-600',
      'critical': 'text-red-600',
      'default': 'text-slate-600'
    };
    return colors[risk] || colors.default;
  };

  return (
    <div className="standard-card p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg ">
          <BarChart3 size={20} />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Health Breakdown</h3>
      </div>
      
      {healthMetrics && healthMetrics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {healthMetrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 transition-all duration-300 hover:bg-white hover:shadow-md group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    {metric.name.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-black ${getRiskTextColor(metric.risk)}`}>
                      {metric.score || 75}
                    </span>
                    <span className="text-[9px] font-black text-slate-300 uppercase">Score</span>
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                   {getRiskIcon(metric.risk)}
                </div>
              </div>
              
              <div className="space-y-4">
                 <div className="w-full bg-slate-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-1000 ${
                        metric.risk === 'very-low' || metric.risk === 'low' ? 'bg-emerald-500' :
                        metric.risk === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${metric.score || 75}%` }}
                    ></div>
                 </div>

                 <p className="text-[11px] font-medium text-slate-600 leading-relaxed min-h-[40px]">
                    {metric.assessment || 'Biometric analysis completed. Metric within established deviation limits.'}
                 </p>
                 
                 <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100">
                    <div className="flex items-start gap-2">
                       <Lightbulb className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                       <p className="text-[10px] font-bold text-emerald-800 leading-snug">
                          {metric.suggestion || 'Continue monitoring clinical baseline levels.'}
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center gap-4 opacity-50">
          <BarChart3 size={40} className="text-slate-300" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Markers Evaluated</p>
        </div>
      )}
    </div>
  );
};

export default MetricsContent;