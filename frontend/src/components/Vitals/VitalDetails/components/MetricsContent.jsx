import { BarChart3, Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const MetricsContent = ({ healthMetrics }) => {
  const getRiskColor = (risk) => {
    const colors = {
      'very-low': 'from-green-500 to-emerald-600',
      'low': 'from-emerald-500 to-green-600',
      'medium': 'from-yellow-500 to-amber-600',
      'high': 'from-orange-500 to-red-500',
      'critical': 'from-red-500 to-pink-600',
      'default': 'from-gray-500 to-slate-600'
    };
    return colors[risk] || colors.default;
  };

  const getRiskIcon = (risk) => {
    const icons = {
      'very-low': <CheckCircle className="w-5 h-5 text-green-500" />,
      'low': <CheckCircle className="w-5 h-5 text-emerald-500" />,
      'medium': <Info className="w-5 h-5 text-amber-500" />,
      'high': <AlertTriangle className="w-5 h-5 text-orange-500" />,
      'critical': <AlertTriangle className="w-5 h-5 text-red-500" />,
      'default': <Info className="w-5 h-5 text-gray-500" />
    };
    return icons[risk] || icons.default;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-emerald-200">
      <h3 className="text-md sm:text-2xl  font-bold mb-8 flex items-center gap-3 text-gray-800">
        <BarChart3 className="w-7 h-7 text-emerald-600" />
        Detailed Metrics Analysis
      </h3>
      
      {healthMetrics && healthMetrics.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {healthMetrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-emerald-50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getRiskColor(metric.risk)} rounded-2xl flex items-center justify-center`}>
                    {metric.icon || <BarChart3/>}
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-lg text-gray-800 capitalize">
                      {metric.name.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-gray-600">{metric.normalRange || 'Standard range'}</div>
                  </div>
                </div>
                <div className="text-centre sm:text-right ">
                  {getRiskIcon(metric.risk)}
                  <div className={`text-2xl font-bold ${
                    metric.risk === 'very-low' ? 'text-green-600' :
                    metric.risk === 'low' ? 'text-emerald-600' :
                    metric.risk === 'medium' ? 'text-yellow-600' :
                    metric.risk === 'high' ? 'text-orange-600' : 
                    metric.risk === 'critical' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.score || 75}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">{metric.risk || 'unknown'} risk</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      metric.risk === 'very-low' ? 'bg-green-500' :
                      metric.risk === 'low' ? 'bg-emerald-500' :
                      metric.risk === 'medium' ? 'bg-yellow-500' :
                      metric.risk === 'high' ? 'bg-orange-500' : 
                      metric.risk === 'critical' ? 'bg-red-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${metric.score || 75}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-sm text-gray-700 mb-3">
                {metric.assessment || 'No specific assessment available.'}
              </div>
              
              <div className="text-emerald-600 text-sm font-medium bg-emerald-50 rounded-lg p-3">
                <Lightbulb className="w-4 h-4 inline mr-2 mb-1" />
                {metric.suggestion || 'Continue monitoring and maintain healthy habits.'}
              </div>

              {metric.trend && (
                <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                  <span>Trend:</span>
                  <span className={`font-medium ${
                    metric.trend === 'improving' ? 'text-green-600' :
                    metric.trend === 'stable' ? 'text-blue-600' :
                    metric.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg mb-2">No metrics data available</p>
          <p className="text-gray-500 text-sm">Generate AI analysis to see detailed metrics</p>
        </div>
      )}
    </div>
  );
};

export default MetricsContent;