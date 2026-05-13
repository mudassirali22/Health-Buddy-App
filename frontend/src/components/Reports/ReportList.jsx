import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useFamily } from '../../context/FamilyContext';
import {
  Search,
  Filter,
  FileText,
  Calendar,
  ArrowRight,
  ListFilter,
  RotateCw,
  CloudUpload,
  AlertCircle,
  ChevronDown,
  TrendingUp,
  Activity,
  ShieldCheck,
  Edit2,
  Trash2,
  Pencil
} from 'lucide-react';
import ConfirmModal from '../common/ConfirmModal';

const ReportList = () => {
  const { selectedFamilyMember } = useFamily();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [dateRange, setDateRange] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reportId: null,
    reportTitle: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports(true);
    const interval = setInterval(() => fetchReports(false), 10000);
    return () => clearInterval(interval);
  }, [selectedFamilyMember]);

  const fetchReports = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const params = selectedFamilyMember ? { familyMember: selectedFamilyMember._id } : { familyMember: 'null' };
      const response = await api.get('/reports', { params });
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    let result = reports.filter(report => {
      // Category Filter
      const matchesType = filter === 'all' || report.reportType === filter;
      
      // Search Logic
      const summaryText = typeof report.aiSummary === 'string' ? report.aiSummary : report.aiSummary?.english || '';
      const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summaryText.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date Range Filter
      let matchesDate = true;
      const reportDate = new Date(report.date);
      const now = new Date();
      if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesDate = reportDate >= weekAgo;
      } else if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        matchesDate = reportDate >= monthAgo;
      } else if (dateRange === 'year') {
        const yearAgo = new Date();
        yearAgo.setFullYear(now.getFullYear() - 1);
        matchesDate = reportDate >= yearAgo;
      }

      // Priority/Status Filter
      let matchesPriority = true;
      if (priorityFilter !== 'all') {
        const status = report.aiAnalysis?.overallAssessment?.status?.toLowerCase() || '';
        const risk = report.aiAnalysis?.overallAssessment?.riskLevel?.toLowerCase() || '';
        
        if (priorityFilter === 'critical') {
          matchesPriority = status === 'critical' || risk === 'very high' || risk === 'high';
        } else if (priorityFilter === 'abnormal') {
          matchesPriority = status === 'needs attention' || status === 'fair' || risk === 'moderate';
        } else if (priorityFilter === 'stable') {
          matchesPriority = status === 'excellent' || status === 'good' || risk === 'low' || risk === 'very low';
        }
      }

      return matchesType && matchesSearch && matchesDate && matchesPriority;
    });

    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [reports, filter, searchTerm, sortBy, dateRange, priorityFilter]);

  const stats = useMemo(() => {
     const total = reports.length;
     const now = new Date();
     const sevenDaysAgo = new Date();
     sevenDaysAgo.setDate(now.getDate() - 7);
     
     const recent = reports.filter(r => new Date(r.date) >= sevenDaysAgo).length;
     
     const critical = reports.filter(r => {
       const status = r.aiAnalysis?.overallAssessment?.status?.toLowerCase() || '';
       const risk = r.aiAnalysis?.overallAssessment?.riskLevel?.toLowerCase() || '';
       return status === 'critical' || risk === 'very high' || risk === 'high';
     }).length;

     const stable = reports.filter(r => {
       const status = r.aiAnalysis?.overallAssessment?.status?.toLowerCase() || '';
       const risk = r.aiAnalysis?.overallAssessment?.riskLevel?.toLowerCase() || '';
       return status === 'good' || status === 'excellent' || risk === 'low' || risk === 'very low';
     }).length;
     
     return { total, recent, critical, stable };
  }, [reports]);

  const reportTypes = useMemo(() => {
    const counts = reports.reduce((acc, report) => {
      acc[report.reportType] = (acc[report.reportType] || 0) + 1;
      return acc;
    }, {});
    return counts;
  }, [reports]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({
      isOpen: true,
      reportId: id,
      reportTitle: title
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      reportId: null,
      reportTitle: ''
    });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/reports/${deleteModal.reportId}`);
      setReports(prev => prev.filter(r => r._id !== deleteModal.reportId));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] animate-pulse">Accessing Medical Records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg ">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Medical Reports</h1>
            <p className="text-slate-500 text-sm font-bold mt-1">
              {selectedFamilyMember ? `Viewing reports for ${selectedFamilyMember.name}` : "Your complete history of medical tests and reports."}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 relative z-10">

          <button onClick={() => navigate('/upload-report')} className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black transition-all shadow-lg  flex items-center gap-2 text-[10px] uppercase tracking-widest">
            <CloudUpload size={14} /> Add New Report
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="standard-card p-5 bg-emerald-600 text-white border-none shadow-md ">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-2">Total Reports</p>
            <div className="flex justify-between items-end">
               <span className="text-3xl font-black leading-none">{stats.total}</span>
               <FileText size={24} className="opacity-30" />
            </div>
         </div>
          <div className="standard-card p-5 border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">New (Last 7 Days)</p>
            <div className="flex justify-between items-end">
               <span className="text-3xl font-black text-slate-800 leading-none">{stats.recent}</span>
               <TrendingUp size={24} className="text-emerald-500 opacity-20" />
            </div>
          </div>
          <div className="standard-card p-5 bg-red-50 border-red-100">
            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2">Critical Alerts</p>
            <div className="flex justify-between items-end">
               <span className="text-3xl font-black text-red-600 leading-none">{stats.critical}</span>
               <AlertCircle size={24} className="text-red-500 opacity-20" />
            </div>
          </div>
          <div className="standard-card p-5 border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Stable Results</p>
            <div className="flex justify-between items-end">
               <span className="text-3xl font-black text-slate-800 leading-none">{stats.stable}</span>
               <ShieldCheck size={24} className="text-emerald-500 opacity-20" />
            </div>
          </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="standard-card p-3 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
            <input
              type="text"
              placeholder="Search reports by title or test name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50/50 border-none rounded-xl pl-12 pr-4 py-3 text-xs focus:ring-1 focus:ring-emerald-500 outline-none font-semibold uppercase tracking-tight"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50/50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none flex-1 sm:w-40 cursor-pointer hover:bg-slate-100 transition-all"
            >
              <option value="date">Newest First</option>
              <option value="title">A-Z Order</option>
            </select>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap gap-3 px-1">
           <div className="relative group">
              <div className="relative">
                 <select 
                   value={dateRange}
                   onChange={(e) => setDateRange(e.target.value)}
                   className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-sm min-w-[150px]"
                 >
                    <option value="all">All Dates</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last Year</option>
                 </select>
                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              </div>
           </div>

           <div className="relative group">
              <div className="relative">
                 <select 
                   value={priorityFilter}
                   onChange={(e) => setPriorityFilter(e.target.value)}
                   className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-sm min-w-[150px]"
                 >
                    <option value="all">All Results</option>
                    <option value="critical">Critical / Emergency</option>
                    <option value="abnormal">Abnormal Findings</option>
                    <option value="stable">Normal Results</option>
                 </select>
                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              </div>
           </div>

           <div className="relative group">
              <div className="relative">
                 <select 
                   value={filter}
                   onChange={(e) => setFilter(e.target.value)}
                   className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-sm min-w-[150px]"
                 >
                    <option value="all">All Types</option>
                    {Object.keys(reportTypes).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                 </select>
                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              </div>
           </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                onClick={() => navigate(`/report/${report._id}`)}
                className="standard-card p-6 cursor-pointer group flex flex-col h-full hover:border-emerald-500 bg-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all border border-slate-50">
                    <FileText size={24} />
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                    {report.reportType}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1 leading-tight uppercase tracking-tight">
                  {report.title || 'Medical Report'}
                </h3>

                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Calendar size={12} className="text-emerald-500" />
                  <span>{formatDate(report.date)}</span>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 mb-6 flex-1">
                  <p className="text-[11px] font-bold leading-relaxed text-slate-600 line-clamp-3 italic">
                    {typeof report.aiSummary === 'string' ? report.aiSummary : (report.aiSummary?.english || 'Analyzing your report findings...')}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-report/${report._id}`);
                      }}
                      className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100 hover:border-emerald-100"
                      title="Edit Report"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(report._id, report.title);
                      }}
                      className="p-2.5 bg-white text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100 hover:border-red-100"
                      title="Delete Report"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg ">
                    View <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="col-span-full py-32 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-md  flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 shadow-inner">
                   <FileText size={48} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-3">No Reports Available</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-xs mx-auto opacity-70 leading-relaxed">You haven't uploaded any medical reports yet. Add your first scan to get started.</p>
                </div>
                <button 
                  onClick={() => navigate('/upload-report')}
                  className="hover:bg-emerald-700 cursor-pointer   bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md  active:scale-95 flex items-center gap-2"
                >
                  <CloudUpload size={16} /> Upload New Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Report"
        message={`Are you sure you want to delete "${deleteModal.reportTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        type="danger"
      />
    </div>
  );
};

export default ReportList;