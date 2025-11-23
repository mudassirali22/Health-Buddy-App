import { Award, FileText, Bell, Clock } from 'lucide-react';
import { formatDate,} from './dateUtils';

const StatsOverview = ({ stats, vitals }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-green-100/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group hover:border-emerald-200">
        <div className="flex items-center justify-between ">
          <div>
            <p className="text-gray-600 text-sm font-medium">Health Score</p>
            <p className="text-4xl sm:text-5xl font-bold text-gray-900">{stats.avgHealthScore}</p>
            <div className="w-50 md:w-100 lg:w-50 bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${stats.avgHealthScore}%` }}
              ></div>
            </div>
          </div>
          <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
            <Award className="text-emerald-600 text-2xl" />
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-blue-100/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group hover:border-emerald-200">
        <div className="flex items-center pt-3 justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Records</p>
            <p className="text-4xl sm:text-5xl font-bold text-gray-900">{stats.totalRecords}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
            <FileText className="text-blue-600 text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-orange-100/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group hover:border-emerald-200">
        <div className="flex items-center pt-2 justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Latest Update</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              {formatDate(vitals[0].date).split(',').slice(0,2).join(',')}
            </p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center">
            <Bell className="text-orange-600 text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;