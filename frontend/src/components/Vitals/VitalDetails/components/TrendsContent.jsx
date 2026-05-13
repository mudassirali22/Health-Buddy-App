import { TrendingUpIcon, ArrowUp, ArrowDown, Minus, Calendar, Activity, Heart, Thermometer, Droplets, Scale, Zap } from 'lucide-react';

const TrendsContent = ({ trendData, formatDate }) => {
 
  const getTrendIcon = (change) => {
    if (change < 0) return <ArrowDown size={14} className="text-emerald-500" />; 
    if (change > 0) return <ArrowUp size={14} className="text-red-500" />;     
    return <Minus size={14} className="text-slate-400" />;                      
  };

  const getTrendColor = (change) => {
    if (change < 0) return 'text-emerald-600'; 
    if (change > 0) return 'text-red-600';   
    return 'text-slate-600';                  
  };

  const vitalConfigs = {
    bloodPressure: {
      label: 'Blood Pressure',
      icon: Activity,
      color: 'red',
      formatValue: (value) => `${value.systolic}/${value.diastolic} mmHg`,
      calculateChange: (current, previous) => current.systolic - previous.systolic,
      formatChange: (change) => `${Math.abs(change)} mmHg`
    },
    heartRate: {
      label: 'Heart Rate',
      icon: Heart,
      color: 'emerald',
      formatValue: (value) => `${value} BPM`,
      calculateChange: (current, previous) => current - previous,
      formatChange: (change) => `${Math.abs(change)} BPM`
    },
    temperature: {
      label: 'Temperature',
      icon: Thermometer,
      color: 'amber',
      formatValue: (value) => `${value}°F`,
      calculateChange: (current, previous) => {
        const idealTemp = 98.6;
        const currentDiff = Math.abs(current - idealTemp);
        const previousDiff = Math.abs(previous - idealTemp);
        return previousDiff - currentDiff; 
      },
      formatChange: (change) => change > 0 ? 'Optimal' : change < 0 ? 'Variance' : 'Stable'
    },  
    weight: {
      label: 'Weight',
      icon: Scale,
      color: 'indigo',
      formatValue: (value) => `${value} kg`,
      calculateChange: (current, previous) => current - previous,
      formatChange: (change) => `${Math.abs(change).toFixed(1)} kg`
    },
    bloodSugar: {
      label: 'Blood Sugar',
      icon: Droplets,
      color: 'pink',
      formatValue: (value) => `${value} mg/dL`,
      calculateChange: (current, previous) => current - previous,
      formatChange: (change) => `${Math.abs(change)} mg/dL`
    }
  };

  const getAvailableVitals = (current, previous) => {
    return Object.keys(vitalConfigs).filter(vitalKey => {
      const currentVal = current[vitalKey];
      const previousVal = previous[vitalKey];
      if (vitalKey === 'bloodPressure') return currentVal?.systolic && previousVal?.systolic;
      return currentVal != null && previousVal != null;
    });
  };

  return (
    <div className="standard-card p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg ">
          <TrendingUpIcon size={20} />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Health Trajectory</h3>
      </div>
      
      {trendData.length > 1 ? (
        <div className="space-y-6">
          {trendData.slice(1).map((trend, index) => {
            const previousTrend = trendData[index];
            const availableVitals = getAvailableVitals(trend, previousTrend);

            return (
              <div key={index} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-800 tracking-tight">
                        {formatDate(trend.date).split(',')[0]}
                      </h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Comparative Analysis: {Math.round((new Date(trend.date) - new Date(previousTrend.date)) / (1000 * 60 * 60 * 24))} Days Gap
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                     <Zap size={10} /> Active Delta
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableVitals.map(vitalKey => {
                    const config = vitalConfigs[vitalKey];
                    const change = config.calculateChange(trend[vitalKey], previousTrend[vitalKey]);

                    return (
                      <div key={vitalKey} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-${config.color}-600 bg-${config.color}-50`}>
                            <config.icon size={16} />
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{config.label}</p>
                            <p className="text-sm font-black text-slate-800">{config.formatValue(trend[vitalKey])}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 mb-1">
                             {getTrendIcon(change)}
                             <span className={`text-[10px] font-black uppercase tracking-widest ${getTrendColor(change)}`}>
                               {config.formatChange(change)}
                             </span>
                          </div>
                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Variance</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center gap-4 opacity-50">
          <TrendingUpIcon size={40} className="text-slate-300" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insufficient Delta History</p>
        </div>
      )}
    </div>
  );
};

export default TrendsContent;