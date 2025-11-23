import { TrendingUpIcon, ArrowUp, ArrowDown, Minus, Calendar, Activity, Heart, Thermometer, Droplets, Scale } from 'lucide-react';

const TrendsContent = ({ trendData, formatDate }) => {
 
  const getTrendIcon = (change) => {
    if (change < 0) return <ArrowDown className="w-4 h-4 text-green-500" />; 
    if (change > 0) return <ArrowUp className="w-4 h-4 text-red-500" />;     
    return <Minus className="w-4 h-4 text-gray-500" />;                      
  };

  const getTrendColor = (change) => {
    if (change < 0) return 'text-green-600'; 
    if (change > 0) return 'text-red-600';   
    return 'text-gray-600';                  
  };

  const getTrendLabel = (change) => {
    if (change < 0) return 'Improved';
    if (change > 0) return 'Increased';
    return 'No change';
  };

  // Simple vital configuration
  const vitalConfigs = {
    bloodPressure: {
      label: 'Blood Pressure',
      icon: <Activity className="w-5 h-5 text-red-600" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      formatValue: (value) => `${value.systolic}/${value.diastolic} mmHg`,
      calculateChange: (current, previous) => {
        return current.systolic - previous.systolic; 
      },
      formatChange: (change) => `${Math.abs(change)} mmHg`
    },
    heartRate: {
      label: 'Heart Rate',
      icon: <Heart className="w-5 h-5 text-green-600" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      formatValue: (value) => `${value} BPM`,
      calculateChange: (current, previous) => current - previous,
      formatChange: (change) => `${Math.abs(change)} BPM`
    },
    temperature: {
      label: 'Temperature',
      icon: <Thermometer className="w-5 h-5 text-orange-600" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      formatValue: (value) => `${value}°F`,
      calculateChange: (current, previous) => {
        // For temperature
        const idealTemp = 98.6;
        const currentDiff = Math.abs(current - idealTemp);
        const previousDiff = Math.abs(previous - idealTemp);
        return previousDiff - currentDiff; 
      },
      formatChange: (change) => change > 0 ? 'Better' : change < 0 ? 'Worse' : 'Same'
    },  
    weight: {
      label: 'Weight',
      icon: <Scale className="w-5 h-5 text-purple-600" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      formatValue: (value) => `${value} kg`,
      calculateChange: (current, previous) => current - previous,
      formatChange: (change) => `${Math.abs(change).toFixed(1)} kg`
    },
    bloodSugar: {
      label: 'Blood Sugar',
      icon: <Droplets className="w-5 h-5 text-pink-600" />,
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      formatValue: (value) => `${value} mg/dL`,
      calculateChange: (current, previous) => current - previous,
      formatChange: (change) => `${Math.abs(change)} mg/dL`
    }
  };

  // Get available vitals for comparison
  const getAvailableVitals = (current, previous) => {
    return Object.keys(vitalConfigs).filter(vitalKey => {
      const currentVal = current[vitalKey];
      const previousVal = previous[vitalKey];
      
      if (vitalKey === 'bloodPressure') {
        return currentVal && previousVal && currentVal.systolic && previousVal.systolic;
      }
      
      return currentVal !== undefined && currentVal !== null &&
             previousVal !== undefined && previousVal !== null;
    });
  };

  const calculateOverallTrend = (current, previous) => {
    const availableVitals = getAvailableVitals(current, previous);
    if (availableVitals.length === 0) return 'no-data';
    
    let improvements = 0;
    
    availableVitals.forEach(vitalKey => {
      const config = vitalConfigs[vitalKey];
      const change = config.calculateChange(current[vitalKey], previous[vitalKey]);
      
      if (vitalKey === 'temperature') {
        if (change > 0) improvements++;
      } else {
        if (change < 0) improvements++;
      }
    });

    const improvementRate = improvements / availableVitals.length;
    
    if (improvementRate >= 0.6) return 'improving';
    if (improvementRate >= 0.3) return 'stable';
    return 'declining';
  };

  const getOverallTrendDisplay = (trend) => {
    const trends = {
      'improving': { icon: <ArrowUp className="w-4 h-4 text-green-500" />, color: 'text-green-600', label: 'Improving' },
      'stable': { icon: <Minus className="w-4 h-4 text-gray-500" />, color: 'text-gray-600', label: 'Stable' },
      'declining': { icon: <ArrowDown className="w-4 h-4 text-red-500" />, color: 'text-red-600', label: 'Declining' },
      'no-data': { icon: <Minus className="w-4 h-4 text-gray-400" />, color: 'text-gray-400', label: 'No Data' }
    };
    
    return trends[trend] || trends['no-data'];
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-emerald-200">
      <h3 className="text-md sm:text-2xl font-bold mb-8 flex items-center gap-3 text-gray-800">
        <TrendingUpIcon className="w-7 h-7 text-green-600" />
        Health Trends & Progress
        {trendData.length > 0 && (
          <span className="text-sm bg-green-100 text-green-700 text-center px-3 py-1 rounded-full">
            {trendData.length} records
          </span>
        )}
      </h3>
      
      {trendData.length > 1 ? (
        <div className="space-y-6">
          {trendData.slice(1).map((trend, index) => {
            const previousTrend = trendData[index];
            const availableVitals = getAvailableVitals(trend, previousTrend);
            const overallTrend = calculateOverallTrend(trend, previousTrend);
            const trendDisplay = getOverallTrendDisplay(overallTrend);

            return (
              <div key={index} className="bg-white rounded-2xl p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-md sm:text-lg text-gray-800">
                        {formatDate(trend.date)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Compared to {formatDate(previousTrend.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Time Gap</div>
                    <div className="text-md sm:text-lg font-semibold text-gray-700">
                      {Math.round((new Date(trend.date) - new Date(previousTrend.date)) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>

                {availableVitals.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableVitals.map(vitalKey => {
                        const config = vitalConfigs[vitalKey];
                        const currentValue = trend[vitalKey];
                        const previousValue = previousTrend[vitalKey];
                        const change = config.calculateChange(currentValue, previousValue);

                        return (
                          <div key={vitalKey} className={`flex items-center justify-between p-4 ${config.bgColor} rounded-xl border ${config.borderColor}`}>
                            <div className="flex items-center gap-3">
                              {config.icon}
                              <div>
                                <div className="font-medium text-gray-700">{config.label}</div>
                                <div className="text-sm text-gray-600">
                                  {config.formatValue(currentValue)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {getTrendIcon(change)}
                              <div className={`text-sm font-medium ${getTrendColor(change)}`}>
                                {config.formatChange(change)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {getTrendLabel(change)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall Health Trend */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-700">Overall Health Trend</div>
                        <div className="flex items-center gap-2">
                          {trendDisplay.icon}
                          <span className={`text-sm font-medium ${trendDisplay.color}`}>
                            {trendDisplay.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Based on {availableVitals.length} of {Object.keys(vitalConfigs).length} metrics
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Minus className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No comparable data available</p>
                    <p className="text-gray-500 text-sm mt-1">Record the same metrics to see trends</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <TrendingUpIcon className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg mb-2">Not enough data for trend analysis</p>
          <p className="text-gray-500 text-sm">Record more readings to see health trends over time</p>
        </div>
      )}
    </div>
  );
};

export default TrendsContent;