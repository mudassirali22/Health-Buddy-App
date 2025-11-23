import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Trash2, 
  ArrowRight, 
  Stethoscope, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  AlertTriangle,
  Activity,
  Droplets,
  Scale,
  Heart,
  Thermometer
} from 'lucide-react';
import { formatDate } from './dateUtils';
import { getMetricCount } from './healthAnalysis';

const VitalsCard = ({ vital, analysis, trend, isSelected, onToggleSelection, onDelete }) => {
  const metricCount = getMetricCount(vital);

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 transition-all duration-300 hover:shadow-2xl ${
      isSelected 
        ? 'border-green-500 ring-4 ring-green-500/20' 
        : `border-gray-100 hover:border-green-100`
    }`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
        <div className="flex items-start gap-4 mb-4 lg:mb-0 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelection}
            className="mt-2 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
          />
          <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
            <Calendar className="text-green-600 text-2xl" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 ">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
                {formatDate(vital.date).slice(0,12)}
              </h3>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-gray-600 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                {metricCount} metrics recorded
              </p>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                analysis.color === 'emerald' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                analysis.color === 'green' ? 'bg-green-100 text-green-700 border-green-200' :
                analysis.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                analysis.color === 'orange' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                'bg-red-100 text-red-700 border-red-200'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  analysis.color === 'emerald' ? 'bg-emerald-500' :
                  analysis.color === 'green' ? 'bg-green-500' :
                  analysis.color === 'yellow' ? 'bg-yellow-500' :
                  analysis.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                }`}></div>
                <span className="font-semibold">{analysis.status}</span>
              </div>
              {trend.trend !== 'new' && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  trend.trend === 'improving' ? 'bg-green-100 text-green-700' :
                  trend.trend === 'declining' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {trend.trend === 'improving' && <TrendingUp className="w-4 h-4" />}
                  {trend.trend === 'declining' && <TrendingDown className="w-4 h-4" />}
                  {trend.trend === 'stable' && <Minus className="w-4 h-4" />}
                  <span className="text-sm font-medium capitalize">
                    {trend.trend} {Math.abs(trend.change)}pts
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-sm sm:text-md gap-3">
          <NavLink
            to={`/vitals/${vital._id}`}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-3 sm:px-6 py-3 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Detailed AI Analysis
            <ArrowRight className="w-4 h-4" />
          </NavLink>
          
          <button
            onClick={onDelete}
            className="bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 border border-red-200 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>

      {/* Vital Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Blood Pressure */}
        {vital.bloodPressure?.systolic && (
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 border border-red-100 relative group hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Blood Pressure</p>
                <p className="text-2xl font-bold text-red-700">
                  {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                </p>
                <p className="text-xs text-red-600 font-medium mt-1">
                  {analysis.metrics.bloodPressure?.status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Blood Sugar */}
        {vital.bloodSugar && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100 relative group hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Blood Sugar</p>
                <p className="text-2xl font-bold text-purple-700">
                  {vital.bloodSugar}
                </p>
                <p className="text-xs text-purple-600 font-medium mt-1">
                  {analysis.metrics.bloodSugar?.status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Weight */}
        {vital.weight && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 relative group hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Weight</p>
                <p className="text-2xl font-bold text-blue-700">
                  {vital.weight}
                </p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  {analysis.metrics.weight?.status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Heart Rate */}
        {vital.heartRate && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 relative group hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Heart Rate</p>
                <p className="text-2xl font-bold text-green-700">
                  {vital.heartRate}
                </p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  {analysis.metrics.heartRate?.status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Temperature */}
        {vital.temperature && (
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100 relative group hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Temperature</p>
                <p className="text-2xl font-bold text-orange-700">
                  {vital.temperature}
                </p>
                <p className="text-xs text-orange-600 font-medium mt-1">
                  {analysis.metrics.temperature?.status}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      {vital.notes && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl break-words p-4 border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            ADDITIONAL NOTES
          </p>
          <p className="text-gray-800 leading-relaxed">{vital.notes}</p>
        </div>
      )}

      {/* Health Alerts */}
      {analysis.warnings.length > 0 && (
        <div className="mt-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200">
          <div className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            HEALTH ALERTS
          </div>
          <div className="space-y-2">
            {analysis.warnings.map((warning, index) => (
              <div key={index} className="text-red-700 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalsCard;