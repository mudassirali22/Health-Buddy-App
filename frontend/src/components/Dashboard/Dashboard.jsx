import { useState, useEffect} from 'react';
import {NavLink, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaHeart,
    FaRegFileAlt,
    FaCalendarAlt, 
    FaLightbulb, 
    FaChartBar, 
    FaPlus, 
    FaArrowRight, 
} from "react-icons/fa";
import { ActivityIcon,
    Droplets,
    Heart,
    HeartHandshake,
    LayoutDashboard,
    Scale,
    Thermometer
 } from 'lucide-react';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, vitalsRes] = await Promise.all([
        api.get('/reports'),
        api.get('/vitals')
      ]);
      setReports(reportsRes.data.data);
      setVitals(vitalsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone:'UTC'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center overflow-hidden">
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="w-16 h-16 border-4 border-green-400 border-b-transparent rounded-full animate-spin animate-reverse absolute top-2 left-1/2 -translate-x-1/2"></div>
            <HeartHandshake className="absolute inset-0 m-auto text-emerald-600 text-2xl animate-pulse" />
          </div>
          <div className="space-y-1">
             <p className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
               Loading your health dashboard...
             </p>
             <p className="text-slate-600 text-base">
               Preparing your medical insights and analytics
             </p>
           </div>

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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4 mb-6 lg:mb-0">
                <div className="relative -top-1 left-2">
                  <div className=" w-14  sm:w-15 h-14 sm:h-15 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/25">
                    <LayoutDashboard className="text-2xl sm:text-3xl text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                   Health Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2 text-sm  sm:text-lg">Track your health journey with precision</p>
                </div>
              </div>  
             <div className="mt-6 lg:mt-0">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl px-8 py-4 shadow-2xl border border-white/40">
                <p className="text-sm text-slate-500 font-medium">Last updated</p>
                <p className="font-semibold text-slate-800 text-md sm:text-lg">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    timeZone: 'UTC'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Reports Card */}
          <NavLink to="/reports">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group hover:border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-slate-600 text-base font-medium">Total Reports</p>
                  <p className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2">{reports.length}</p>
                  <p className="text-emerald-600 text-base font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                    <span>View all reports</span>
                    <FaArrowRight className="text-sm transform group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110  transition-all duration-500">
                  <FaRegFileAlt className="text-2xl sm:text-3xl text-white" />
                </div>
              </div>
            </div>
          </NavLink>

          {/* Vitals Card */}
          <NavLink to="/vitals">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group hover:border-red-200">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-slate-600 text-base font-medium">Vital Records</p>
                  <p className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2">{vitals.length}</p>
                  <p className="text-red-600 text-base font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                    <span>Track vitals</span>
                    <FaArrowRight className="text-sm transform group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110  transition-all duration-500">
                  <FaHeart className="text-2xl sm:text-3xl text-white" />
                </div>
              </div>
            </div>
          </NavLink>

          {/* Last Check Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:border-purple-200">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-slate-600 text-base font-medium">Last Check-up</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {reports[0] ? formatDate(reports[0].date) : 'No records'}
                </p>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110  transition-all duration-500">
                <FaCalendarAlt className="text-2xl sm:text-3xl text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Recent Reports Card */}
          <div className="bg-white/80  backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 px-8 py-6 border-b border-slate-200/60">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-2xl font-bold text-slate-800 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FaRegFileAlt className="text-blue-600 text-xl" />
                  </div>
                  Recent Reports
                </h2>
                <NavLink
                  to="/upload-report"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 sm:py-3 rounded-2xl flex items-center gap-3 text-base font-semibold transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5"
                >
                  <FaPlus className="text-sm" /> Add New Report
                </NavLink>
              </div>
            </div>
            
            <div className="p-9">
              {reports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-slate-100/80 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <FaRegFileAlt className="text-4xl text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-lg sm:text-xl mb-4 font-medium">No reports yet</p>
                  <NavLink
                    to="/upload-report"
                    className="text-blue-600 hover:text-blue-700 font-semibold text-md sm:text-lg inline-flex items-center gap-3 transition-all duration-300 hover:gap-4"
                  >
                    Upload your first report
                    <FaArrowRight className="text-sm" />
                  </NavLink>
                </div>
              ) : (
                <div className="space-y-5 max-h-96 overflow-y-auto custom-scrollbar  pr-2">
                  {reports.slice(0, 10).map((report) => (
                    <NavLink
                      key={report._id}
                      to={`/report/${report._id}`}
                      className="block p-7 ml-3 bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-blue-300 hover:shadow-xl transition-all duration-500 group hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-600 transition-colors duration-300">
                            {report.title}
                          </h3>
                          <p className="text-slate-600 text-base">{report.reportType}</p>
                        </div>
                        <span className="text-sm font-medium bg-blue-100 text-blue-600 px-4 py-2 rounded-2xl">
                          {formatDate(report.date)}
                        </span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
              {/* View All Link */}
              {reports.length > 10 && (
                <div className="mt-6 text-center">
                  <NavLink
                    to="/reports"
                    className="text-blue-600 hover:text-blue-700 font-semibold text-lg inline-flex items-center gap-2 transition-all duration-300 hover:gap-3"
                  >
                    View all {reports.length} reports
                    <FaArrowRight className="text-sm" />
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Recent Vitals Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40">
            <div className="bg-gradient-to-r from-slate-50 to-red-50/50 px-8 py-6 border-b border-slate-200/60">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-2xl font-bold text-slate-800 flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FaHeart className="text-red-600  sm:text-xl" />
                  </div>
                  Recent Vitals
                </h2>
                <NavLink
                  to="/add-vitals"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 sm:py-3 rounded-2xl flex items-center gap-3 text-base font-semibold transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5"
                >
                  <FaPlus className="text-sm" /> Add New Vitals
                </NavLink>
              </div>
            </div>
            
            <div className="p-8">
              {vitals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-slate-100/80 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <FaHeart className="text-4xl text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-lg sm:text-xl mb-4 font-medium">No vitals recorded yet</p>
                  <NavLink
                    to="/add-vitals"
                    className="text-red-600 hover:text-red-700 font-semibold text-md sm:text-lg inline-flex items-center gap-3 transition-all duration-300 hover:gap-4"
                  >
                    Add your first vitals
                    <FaArrowRight className="text-sm" />
                  </NavLink>
                </div>
              ) : (
                
                <div className=" max-h-96 overflow-y-auto custom-scrollbar pr-2">
                 
                  {vitals.slice(0, 10).map((vital) => (
                    <NavLink to={`/vitals/${vital._id}`}
                      key={vital._id}
                    >
                    <div
                      className="p-6 mt-4 ml-3 bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold bg-purple-100 text-purple-600 px-4 py-2 rounded-2xl">
                          {formatDate(vital.date)}
                        </span>
                      </div>
                     
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                            {/* Blood Pressure */}
                            {vital.bloodPressure?.systolic && (
                              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 border border-red-100 relative group hover:scale-105 transition-transform duration-200">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <ActivityIcon className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Blood Pressure</p>
                                    <p className="text-2xl font-bold text-red-700">
                                      {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                                    </p>
                                    <p className="text-xs text-red-600 font-medium mt-1">
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
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                    </div>
                  </NavLink>
                  ))}
                </div>
              )}
              {/* View All Link */}
              {vitals.length > 10 && (
                <div className="mt-6 text-center">
                  <NavLink
                    to="/vitals"
                    className="text-red-600 hover:text-red-700 font-semibold text-lg inline-flex items-center gap-2 transition-all duration-300 hover:gap-3"
                  >
                    View all {vitals.length} vitals
                    <FaArrowRight className="text-sm" />
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl shadow-3xl p-10 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-38 h-38 sm:w-40 sm:h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 backdrop-blur-sm"></div>
          <div className="absolute bottom-0 left-0 w-29 h-29 sm:w-32 sm:h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 backdrop-blur-sm"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                <FaLightbulb className="text-yellow-300 text-2xl" />
              </div>
              Quick Actions
            </h3>
            <p className="text-emerald-100 text-md sm:text-lg mb-8 font-light">Manage your health records efficiently</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <NavLink
                to="/upload-report"
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-8 hover:bg-white/20 transition-all duration-500 border border-white/20 hover:border-white/30 group hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <FaRegFileAlt className="text-3xl text-white" />
                  </div>
                  <p className="font-semibold text-xl mb-3">Upload Report</p>
                  <p className="text-emerald-100 text-base font-light">Add medical documents</p>
                </div>
              </NavLink>
              
              <NavLink
                to="/add-vitals"
                className="bg-white/10 backdrop-blur-xl rounded-2xl  p-4 sm:p-8 hover:bg-white/20 transition-all duration-500 border border-white/20 hover:border-white/30 group hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <FaHeart className="text-3xl text-white" />
                  </div>
                  <p className="font-semibold text-xl mb-3">Add Vitals</p>
                  <p className="text-emerald-100 text-base font-light">Track BP, sugar, weight....</p>
                </div>
              </NavLink>
              
              <NavLink
                to="/timeline"
                className="bg-white/10 backdrop-blur-xl rounded-2xl  p-4 sm:p-8 hover:bg-white/20 transition-all duration-500 border border-white/20 hover:border-white/30 group hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <FaChartBar className="text-3xl text-white" />
                  </div>
                  <p className="font-semibold text-xl mb-3">View Timeline</p>
                  <p className="text-emerald-100 text-base font-light">See complete history</p>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;