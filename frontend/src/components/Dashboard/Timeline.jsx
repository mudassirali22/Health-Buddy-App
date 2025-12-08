import { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../services/api';
import {
  FileText,
  HeartPulse,
  BarChart3,
  Calendar,
  Filter,
  Plus,
  ArrowRight,
  Activity,
  Droplets,
  Scale,
  Heart,
  Clock,
  Sparkles,
  Zap,
  Brain,
  ChevronRight,
  Eye,
  TableOfContents,
  History
} from 'lucide-react';

const Timeline = () => {
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [reportsRes, vitalsRes] = await Promise.all([
        api.get('/reports'),
        api.get('/vitals')
      ]);
      setReports(reportsRes.data.data);
      setVitals(vitalsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load health data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = useMemo(() => (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

const getTimeAgo = (dateString) => {
  if (!dateString) return "";

  const now = new Date();
  const todayStart = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ));

  const d = new Date(dateString);
  const reportDate = new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  ));

  const diffMs = todayStart - reportDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

  const getAllRecords = useMemo(() => {
    const allRecords = [
      ...reports.map(r => ({ ...r, type: 'report' })),
      ...vitals.map(v => ({ ...v, type: 'vital' }))
    ].filter(record => record && record._id && record.date);

    return allRecords
      .filter(record => {
        if (filter === 'reports') return record.type === 'report';
        if (filter === 'vitals') return record.type === 'vital';
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [reports, vitals, filter]);

  const TimelineDot = ({ type }) => (
    <div
      className={`absolute top-4 lg:top-1.5 left-8 lg:left-1/2 w-6 h-6 rounded-full border-4 border-white transform -translate-x-1/2 z-10 shadow-lg ${
        type === 'report' 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
          : 'bg-gradient-to-r from-blue-500 to-cyan-600'
      }`}
    />
  );

  const DateCard = ({ date }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-emerald-200 text-center min-w-[160px] group-hover:scale-103 transition-transform duration-300">
      <div className="flex items-center justify-center gap-3 text-gray-600 mb-2">
        <Calendar className="w-5 h-5" />
        <span className="text-lg font-semibold">{formatDate(date)}</span>
      </div>
      <div className="flex items-center justify-center gap-2 text-gray-500 mb-3">
        <Clock className="w-4 h-4" />
        <span className="text-sm">{getTimeAgo(date)}</span>
      </div>
    </div>
  );

  // health journey days calculation 
  const healthJourneyDays = useMemo(() => {
    if (getAllRecords.length === 0) return 0;
    const lastRecordDate = new Date(getAllRecords[getAllRecords.length - 1]?.date);
    const today = new Date();
    return Math.ceil((today - lastRecordDate) / (1000 * 60 * 60 * 24));
  }, [getAllRecords]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center overflow-hidden">
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="w-16 h-16 border-4 border-green-400 border-b-transparent rounded-full animate-spin animate-reverse absolute top-2 left-1/2 -translate-x-1/2"></div>
            <TableOfContents  className="absolute inset-0 bg-green-200 rounded m-auto text-emerald-700 text-2xl animate-pulse" />
          </div>
          <div className="space-y-1">
             <p className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
               Loading Health Intelligence
             </p>
             <p className="text-slate-600 text-base">
               Preparing your health timeline...
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-25 h-25 sm:w-28 sm:h-28 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Brain className="text-5xl text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Unable to Load Data
          </h3>
          <p className="text-gray-600 text-xl mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="relative left-3">
              <div className="w-14 h-14 sm:w-15 sm:h-15 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25">
                <History className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                Health Timeline
              </h1>
              <p className="text-sm sm:text-lg text-gray-600 flex items-center gap-2">
                Your complete health journey in one place
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6 lg:mt-0">
            <NavLink
              to="/upload-report"
              className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 sm:px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 flex items-center gap-3"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Upload Report
            </NavLink>
            <NavLink
              to="/add-vitals"
              className="group bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 sm:px-8 py-4  rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 flex items-center gap-3"
            >
              <HeartPulse className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Add Vitals
            </NavLink>
          </div>
        </div>

          {/* Stats Overview */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-emerald-200 hover:scale-105 transition-transform duration-300">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-gray-600 text-sm font-medium mb-2">Total Records</p>
                 <p className="text-3xl sm:text-4xl font-bold text-gray-900">{reports.length + vitals.length}</p>
               </div>
               <div className="w-15 h-15 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                 <BarChart3 className="text-white text-lg sm:text-2xl" />
               </div>
             </div>
           </div>
          
           <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-200 hover:scale-105 transition-transform duration-300">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-gray-600 text-sm font-medium mb-2">Medical Reports</p>
                 <p className=" text-3xl sm:text-4xl font-bold text-gray-900">{reports.length}</p>
                 <p className="text-blue-600 text-sm font-medium mt-2 flex items-center gap-1">
                   <FileText className="w-4 h-4" />
                   Latest: {reports[0]?.title || 'None'}
                 </p>
               </div>
               <div className="w-15 h-15 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                 <FileText className="text-white text-lg sm:text-2xl" />
               </div>
             </div>
           </div>

           <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-200 hover:scale-105 transition-transform duration-300">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-gray-600 text-sm font-medium mb-2">Vital Records</p>
                 <p className="text-3xl sm:text-4xl font-bold text-gray-900">{vitals.length}</p>
                 <p className="text-purple-600 text-sm font-medium mt-2 flex items-center gap-1">
                   <HeartPulse className="w-4 h-4" />
                   Active monitoring
                 </p>
               </div>
               <div className="w-15 h-15 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                 <HeartPulse className="text-white text-lg sm:text-2xl" />
               </div>
             </div>
           </div>

           <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-orange-200 hover:scale-105 transition-transform duration-300">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-gray-600 text-sm font-medium mb-2">Health Journey</p>
                 <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {healthJourneyDays} days
                </p>
                <p className="text-orange-600 text-sm font-medium mt-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Continuous tracking
                </p>
              </div>
              <div className="w-15 h-15 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="text-white text-lg sm:text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-emerald-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center flex-col sm:flex-row gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Filter className="text-white text-lg sm:text-xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2x text-center font-bold text-gray-800">Timeline Intelligence</h2>
                <p className="text-gray-600 text-sm sm:text-md">Filter and explore your health data</p>
              </div>
            </div>
            
            <div className="flex bg-gray-100 flex-col md:flex-row rounded-2xl p-2">
              <button
                onClick={() => setFilter('all')}
                aria-pressed={filter === 'all'}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                All ({reports.length + vitals.length})
              </button>
              <button
                onClick={() => setFilter('reports')}
                aria-pressed={filter === 'reports'}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  filter === 'reports'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                Reports ({reports.length})
              </button>
              <button
                onClick={() => setFilter('vitals')}
                aria-pressed={filter === 'vitals'}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  filter === 'vitals'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                Vitals ({vitals.length})
              </button>
            </div>
          </div>
        </div>

        {getAllRecords.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-16 text-center border border-emerald-200">
            <div className="w-30 h-30 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Brain className="w-14 h-14 sm:w-15 sm:h-15 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Start Your Health Journey
            </h3>
            <p className="text-gray-600 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Begin tracking your health with AI-powered insights. Upload medical reports and record vital signs to unlock personalized health intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <NavLink
                to="/upload-report"
                className="group bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 sm:px-10 py-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 flex items-center gap-4 justify-center text-lg"
              >
                <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Upload First Report
              </NavLink>
              <NavLink
                to="/add-vitals"
                className="group bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 sm:px-10 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 flex items-center gap-4 justify-center text-lg"
              >
                <HeartPulse className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Record First Vitals
              </NavLink>
            </div>
          </div>
        ) : (
          <div className="relative">

            {/*Timeline line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-emerald-400 via-green-400 to-green-300 transform -translate-x-1/2 shadow-lg"></div>

            <div className="space-y-12">
              {getAllRecords.map((record, index) => (
                <div key={`${record.type}-${record._id}-${index}`} className="relative group">
                  <TimelineDot type={record.type} />
                  
                  <div className={`flex flex-col lg:flex-row gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Date Card*/}
                    <div className="lg:w-2/5 flex justify-center lg:justify-start">
                      <DateCard date={record.date} />
                    </div>

                    {/*Content Card */}
                    <div className="lg:w-3/5 flex justify-center lg:justify-start">
                      <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 hover:shadow-3xl transition-all duration-500 w-full max-w-2xl group hover:scale-102 ${
                        record.type === 'report' 
                          ? 'hover:border-emerald-300 border-emerald-200' 
                          : 'hover:border-blue-300 border-blue-200'
                      }`}>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                              record.type === 'report' 
                                ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                                : 'bg-gradient-to-r from-blue-500 to-cyan-600'
                            }`}>
                              {record.type === 'report' ? (
                                <FileText className="text-white text-lg sm:text-2xl" />
                              ) : (
                                <HeartPulse className="text-white text-lg sm:text-2xl" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                                {record.type === 'report' ? record.title : 'Vital Signs Analysis'}
                              </h3>
                              <div className="flex items-center gap-3">
                                <p className={`text:md sm:text-lg font-semibold ${
                                  record.type === 'report' ? 'text-emerald-600' : 'text-blue-600'
                                }`}>
                                  {record.type === 'report' ? 'Medical Report' : 'Health Metrics'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {record.type === 'report' && (
                            <span className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-200">
                              {record.reportType}
                            </span>
                          )}
                        </div>

                        {record.type === 'report' ? (
                          <div>
                            {record.aiSummary?.english && (
                              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                  <Brain className="w-5 h-5 text-emerald-600" />
                                  <span className="font-semibold text-gray-800">AI Analysis Summary</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-md sm:text-lg">
                                  {record.aiSummary.english}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-4">
                              <NavLink
                                to={`/report/${record._id}`}
                                className="group bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
                              >
                                <Eye className="w-5 h-5" />
                                View Full Analysis
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </NavLink>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {record.bloodPressure?.systolic && (
                                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 border border-red-200 hover:scale-105 transition-transform duration-300">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Activity className="w-6 h-6 text-red-600" />
                                    <p className="text-sm font-semibold text-red-600">Blood Pressure</p>
                                  </div>
                                  <p className="font-bold text-red-700 text-lg sm:text-2xl mb-1">
                                    {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                                  </p>
                                  <p className="text-xs text-red-600 font-medium">mmHg</p>
                                </div>
                              )}
                              {record.bloodSugar && (
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-200 hover:scale-105 transition-transform duration-300">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Droplets className="w-6 h-6 text-purple-600" />
                                    <p className="text-sm font-semibold text-purple-600">Blood Sugar</p>
                                  </div>
                                  <p className="font-bold text-purple-700 text-lg sm:text-2xl mb-1">{record.bloodSugar}</p>
                                  <p className="text-xs text-purple-600 font-medium">mg/dL</p>
                                </div>
                              )}
                              {record.weight && (
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200 hover:scale-105 transition-transform duration-300">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Scale className="w-6 h-6 text-blue-600" />
                                    <p className="text-sm font-semibold text-blue-600">Weight</p>
                                  </div>
                                  <p className="font-bold text-blue-700 text-lg sm:text-2xl mb-1">{record.weight}</p>
                                  <p className="text-xs text-blue-600 font-medium">kg</p>
                                </div>
                              )}
                              {record.heartRate && (
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 hover:scale-105 transition-transform duration-300">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Heart className="w-6 h-6 text-green-600" />
                                    <p className="text-sm font-semibold text-green-600">Heart Rate</p>
                                  </div>
                                  <p className="font-bold text-green-700 text-lg sm:text-2xl mb-1">{record.heartRate}</p>
                                  <p className="text-xs text-green-600 font-medium">bpm</p>
                                </div>
                              )}
                            </div>
                            
                            {record.notes && (
                              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                  <FileText className="w-5 h-5 text-gray-600" />
                                  <p className="text-sm font-semibold text-gray-700">Clinical Notes</p>
                                </div>
                                <p className="text-gray-800 text-lg break-words leading-relaxed">{record.notes}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4">
                              <NavLink
                                to={`/vitals/${record._id}`}
                                className="group bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
                              >
                                <Eye className="w-5 h-5" />
                                 View Full AI Analysis
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}    

        {/* Health Journey Summary */}
        {getAllRecords.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg sm:text-2xl font-bold mb-3">Your Health Journey</h3>
                 <p className="text-green-100 text-md sm:text-lg">
                  You've created {getAllRecords.length} health records across your journey. 
                  Keep tracking for better insights!
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-6 md:mt-0">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold">{reports.length}</div>
                  <div className="text-green-100 text-sm">Medical Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold">{vitals.length}</div>
                  <div className="text-green-100 text-sm">Vital Records</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;