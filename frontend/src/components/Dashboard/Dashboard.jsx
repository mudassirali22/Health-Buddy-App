import { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';

import {
   Activity,
   Heart,
   Brain,
   Upload,
   Plus,
   Users,
   Zap,
   ChevronRight,
   FileText,
   Target,
   ArrowRight,
   ShieldCheck,
   TrendingUp,
   Clock,
   User,
   Droplets,
   X,
   KeyRound,
   AlertTriangle
} from 'lucide-react';
import { getDetailedHealthAnalysis, getMetricCount } from '../Vitals/VitalsLists/components/healthAnalysis';

const Dashboard = () => {
   const { selectedFamilyMember, familyMembers, addFamilyMember } = useFamily();
   const { user } = useAuth();
      const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [reports, setReports] = useState([]);
   const [vitals, setVitals] = useState([]);
   const [lastUpdated, setLastUpdated] = useState(new Date());

   // Family Modal State
   const [showAddModal, setShowAddModal] = useState(false);
   const [error, setError] = useState('');
   const [formData, setFormData] = useState({
      name: '',
      relation: 'Other',
      age: '',
      gender: '',
      bloodGroup: '',
      phoneNumber: '',
      email: '',
      address: ''
   });

   const relations = ['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Sibling', 'Brother', 'Sister', 'Wife', 'Husband', 'Uncle', 'Aunt', 'Cousin', 'Guardian', 'Grandparent', 'Other'];
   const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
   const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

   useEffect(() => {
      fetchData(true);
      const interval = setInterval(() => fetchData(false), 10000);
      return () => clearInterval(interval);
   }, [selectedFamilyMember]);

   const fetchData = async (isInitial = false) => {
      try {
         if (isInitial) setLoading(true);
         const params = selectedFamilyMember ? { familyMember: selectedFamilyMember._id } : { familyMember: 'null' };
         const [reportsRes, vitalsRes] = await Promise.all([
            api.get('/reports', { params }),
            api.get('/vitals', { params })
         ]);
         setReports(reportsRes.data.data || []);
         setVitals(vitalsRes.data.data || []);
         setLastUpdated(new Date());
      } catch (error) {
         console.error('Dashboard fetch error:', error);
      } finally {
         if (isInitial) setLoading(false);
      }
   };

   const stats = useMemo(() => {
      // 1. Report Analysis
      const reportCriticalCount = reports.filter(r => r.priority === 'critical').length;
      const reportAbnormalCount = reports.filter(r => r.priority === 'abnormal').length;

      // 2. Vital Analysis
      let vitalCriticalCount = 0;
      let vitalAbnormalCount = 0;
      let latestVitalScore = 100;

      if (vitals.length > 0) {
         const latestVital = vitals[0];
         const analysis = getDetailedHealthAnalysis(latestVital);
         latestVitalScore = analysis.overallScore;
         
         // Count critical/abnormal in all vitals for overview stats
         vitals.forEach(v => {
            const ana = getDetailedHealthAnalysis(v);
            if (ana.status === 'Critical') vitalCriticalCount++;
            else if (ana.status === 'Needs Attention' || ana.status === 'Fair') vitalAbnormalCount++;
         });
      }

      const totalCritical = reportCriticalCount + vitalCriticalCount;
      const totalAbnormal = reportAbnormalCount + vitalAbnormalCount;

      // 3. Overall Health Score Calculation
      const healthScore = (reports.length === 0 && vitals.length === 0) 
         ? 100 
         : Math.max(40, Math.round((latestVitalScore + (100 - (totalCritical * 15) - (totalAbnormal * 5))) / 2));
      
      const hasRecentVitals = vitals.some(v => {
         const d = new Date(v.date);
         const now = new Date();
         return (now - d) < (72 * 60 * 60 * 1000);
      });

      const compliance = hasRecentVitals ? 96 : 64;

      // 4. Detailed Summary Construction
      let detailedSummary = "Your health overview is stable. Keep up the regular monitoring!";
      let summaryLevel = 'normal';

      if (totalCritical > 0) {
         summaryLevel = 'critical';
         const latestVitalWarnings = vitals.length > 0 ? getDetailedHealthAnalysis(vitals[0]).warnings : [];
         const criticalReports = reports.filter(r => r.priority === 'critical');
         
         if (latestVitalWarnings.length > 0) {
            detailedSummary = `Alert: ${latestVitalWarnings[0]}. ${totalCritical > 1 ? `Plus ${totalCritical - 1} other markers need review.` : ''}`;
         } else if (criticalReports.length > 0) {
            detailedSummary = `Critical findings detected in your ${criticalReports[0].reportType} report. Medical consultation advised.`;
         }
      } else if (totalAbnormal > 0) {
         summaryLevel = 'abnormal';
         detailedSummary = `Heads up: ${totalAbnormal} metrics are slightly outside optimal range. Monitor these over the next few days.`;
      }

      // 5. Realistic Tracking Progress (Score-based)
      const latestVitalRecord = vitals[0] || {};
      const vitalAnalysis = vitals.length > 0 ? getDetailedHealthAnalysis(latestVitalRecord) : null;
      
      const availableMetrics = [
         { label: 'Pulse Tracking', val: vitalAnalysis?.metrics?.heartRate?.score || 0, color: 'bg-emerald-500', icon: Heart },
         { label: 'Pressure Monitoring', val: vitalAnalysis?.metrics?.bloodPressure?.score || 0, color: 'bg-red-500', icon: Activity },
         { label: 'Glucose Logging', val: vitalAnalysis?.metrics?.bloodSugar?.score || 0, color: 'bg-blue-500', icon: Droplets },
         { label: 'Lab Scans', val: reports.length > 0 ? 100 : 0, color: 'bg-indigo-500', icon: FileText }
      ].filter(m => m.val > 0 || (m.label === 'Lab Scans' && reports.length > 0));

      return {
         criticalCount: totalCritical,
         abnormalCount: totalAbnormal,
         healthScore,
         totalRecords: reports.length + vitals.length,
         compliance,
         availableMetrics,
         detailedSummary,
         summaryLevel
      };
   }, [reports, vitals]);

   const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
         month: 'short',
         day: 'numeric',
         year: 'numeric'
      });
   };

   const handleOpenAdd = () => {
      setFormData({ 
         name: '', 
         relation: 'Other', 
         age: '', 
         gender: '', 
         bloodGroup: '',
         phoneNumber: '',
         email: '',
         address: ''
      });
      setError('');
      setShowAddModal(true);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      const data = { ...formData };
      if (data.age) data.age = parseInt(data.age);
      else delete data.age;

      const result = await addFamilyMember(data);

      if (result.success) {
         setShowAddModal(false);
               } else {
         setError(result.error);
               }
   };

   if (loading) {
      return (
         <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px]  font-black text-emerald-600 uppercase tracking-[0.2em] animate-pulse">Loading Dashboard...</p>
         </div>
      );
   }

   return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-in fade-in duration-500">

         {/* 1. Top Welcome Banner */}
         <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-5">
               <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg ">
                  <Heart size={28} />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">
                     Welcome, <span className="text-emerald-600">{user?.name?.split(' ')[0]}</span>
                  </h1>
                  <div className="flex items-center gap-3">
                     <p className="text-slate-500 text-sm font-medium">
                        {selectedFamilyMember ? `Managing health records for ${selectedFamilyMember.name}` : "Your health overview."}
                     </p>
                  </div>
               </div>
            </div>

            <div className="flex flex-wrap gap-3 relative z-10">
               <button onClick={() => navigate('/vitals')} className="cursor-pointer bg-white border border-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all hover:bg-slate-50 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <Activity size={16} /> View Vitals
               </button>
               <button onClick={() => navigate('/reports')} className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg  flex items-center gap-2 text-xs uppercase tracking-wider">
                  <FileText size={16} /> View Reports
               </button>
            </div>
         </div>

         {/* 2. Stats Section - 3 Column Grid (Reminders Removed) */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NavLink to="/vitals" className="standard-card p-5 bg-emerald-600 text-white border-none shadow-md  hover:bg-emerald-700 transition-colors cursor-pointer group">
               <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-2">Total Vitals</p>
               <div className="flex justify-between items-end">
                  <span className="text-3xl font-black leading-none">{vitals.length}</span>
                  <Activity size={24} className="opacity-30 group-hover:scale-110 transition-transform" />
               </div>
            </NavLink>
            <NavLink to="/reports" className="standard-card p-5 border-emerald-500 hover:shadow-lg transition-all cursor-pointer group">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Reports</p>
               <div className="flex justify-between items-end">
                  <span className="text-3xl font-black text-slate-800 leading-none">{reports.length}</span>
                  <FileText size={24} className="text-emerald-500 opacity-20 group-hover:scale-110 transition-transform" />
               </div>
            </NavLink>
            <NavLink to="/ai-assistant" className="standard-card p-5 border-purple-500 hover:shadow-lg transition-all cursor-pointer group">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Smart Analysis</p>
               <div className="flex justify-between items-end">
                  <span className="text-3xl font-black text-slate-800 leading-none">{stats.criticalCount > 0 ? 'Review' : 'Healthy'}</span>
                  <Brain size={24} className="text-purple-500 opacity-20 group-hover:scale-110 transition-transform" />
               </div>
            </NavLink>
         </div>

         {/* 3. Secondary Metrics - 2 Column Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clinical Assessment */}
            <div className="standard-card p-6 bg-slate-800 text-white border-none shadow-md relative overflow-hidden group">
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between mb-8">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                        stats.summaryLevel === 'critical' ? 'bg-red-500/20 text-red-400 border-red-400/20' :
                        stats.summaryLevel === 'abnormal' ? 'bg-amber-500/20 text-amber-400 border-amber-400/20' :
                        'bg-emerald-500/20 text-emerald-400 border-emerald-400/20'
                     }`}>
                        {stats.summaryLevel === 'critical' ? <AlertTriangle size={24} /> : <Brain size={24} />}
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Health Score</p>
                        <p className={`text-3xl font-black ${
                           stats.summaryLevel === 'critical' ? 'text-red-500' :
                           stats.summaryLevel === 'abnormal' ? 'text-amber-500' : 'text-emerald-400'
                        }`}>{stats.healthScore}</p>
                     </div>
                  </div>
                  <div>
                     <h3 className="text-sm font-black uppercase tracking-tight mb-2">Health Summary</h3>
                     <p className="text-slate-400 text-xs font-medium leading-relaxed">
                        {stats.detailedSummary}
                     </p>
                  </div>
               </div>
            </div>

            {/* Protocol Adherence */}
            <div className="standard-card p-6 relative overflow-hidden group">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                     <Target size={24} />
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consistency</p>
                     <p className="text-3xl font-black text-blue-600">{stats.compliance}%</p>
                  </div>
               </div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4">Health Tracking Progress</h3>
               <div className="space-y-5">
                  {stats.availableMetrics.length > 0 ? (
                     stats.availableMetrics.map((metric, idx) => (
                        <div key={idx} className="space-y-2">
                           <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                              <span className="flex items-center gap-1.5">
                                 <metric.icon size={10} className="text-slate-300" />
                                 {metric.label}
                              </span>
                              <span className={metric.val < 70 ? 'text-red-500' : 'text-slate-400'}>{metric.val < 100 ? `${metric.val}% Score` : 'Optimal'}</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${metric.color} rounded-full transition-all duration-1000`} style={{ width: `${metric.val}%` }}></div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="py-4 text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No clinical data available</p>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* 4. Identity & Network - 2 Column Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Identity Card */}
            <div className="standard-card p-6 border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-sm">
                     {(selectedFamilyMember?.name || user?.name)?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                     <h4 className="font-black text-slate-800 leading-tight uppercase tracking-tight">{selectedFamilyMember?.name || user?.name}</h4>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-emerald-500" /> ID: {selectedFamilyMember?.mrNumber || user?.mrNumber || 'HB-8820'}
                     </p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-black opacity-70 uppercase tracking-widest mb-1 text-slate-400">Blood Group</p>
                  <p className="font-black text-lg text-slate-800">{selectedFamilyMember?.bloodGroup || user?.bloodGroup || '----'}</p>
               </div>
            </div>

            {/* Registry Network (If Admin) */}
            {user?.isAdmin && !selectedFamilyMember ? (
               <div className="standard-card p-6 border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <Users size={14} className="text-emerald-600" /> Family Members
                     </h3>
                     <NavLink to="/family" className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Manage</NavLink>
                  </div>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                     <NavLink 
                        onClick={handleOpenAdd}
                        className="cursor-pointer flex flex-col items-center gap-2 flex-shrink-0 group"
                     >
                        <div className="w-10 h-10 bg-slate-50 border border-dashed border-slate-300 text-slate-400 rounded-full flex items-center justify-center text-sm font-black shadow-sm group-hover:border-emerald-500 group-hover:text-emerald-600 transition-all">
                           <Plus size={20} />
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase group-hover:text-emerald-600">Add New</p>
                     </NavLink>

                     {familyMembers.length > 0 ? (
                        familyMembers.slice(0, 4).map(member => (
                           <div key={member._id} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => navigate('/family')}>
                              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-black shadow-sm hover:scale-105 transition-all">
                                 {member.name[0]}
                              </div>
                              <p className="text-[8px] font-black text-slate-500 uppercase">{member.name.split(' ')[0]}</p>
                           </div>
                        ))
                     ) : null}
                  </div>
               </div>
            ) : (
               <div className="standard-card p-6 border-slate-100 flex items-center justify-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     Identity Role: <span className="text-emerald-600">{selectedFamilyMember ? selectedFamilyMember.relation : 'Primary'}</span>
                  </p>
               </div>
            )}
         </div>

         {/* 5. Activity Matrix - Full Width */}
         <div className="standard-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                     <TrendingUp size={16} />
                  </div>
                  <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Recent Health Events</h3>
               </div>
               <NavLink to="/timeline" className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                  Full History <ChevronRight size={12} />
               </NavLink>
            </div>
            <div className="divide-y divide-slate-50">
               {([...reports, ...vitals].length > 0) ? (
                  [...reports.map(r => ({ ...r, eventType: 'report' })), 
                   ...vitals.map(v => ({ ...v, eventType: 'vital', title: `Vital Signs Recorded` }))]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((event, idx) => (
                     <div 
                        key={event._id || idx} 
                        onClick={() => navigate(event.eventType === 'report' ? `/report/${event._id}` : `/vitals`)} 
                        className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-all cursor-pointer group border-b border-slate-50 last:border-0"
                     >
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-sm ${
                              event.eventType === 'report' && event.priority === 'critical' ? 'bg-red-50 text-red-500 border border-red-100' :
                              event.eventType === 'report' && event.priority === 'abnormal' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              event.eventType === 'vital' ? 'bg-blue-50 text-blue-500 border border-blue-100' :
                              'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                           }`}>
                              {event.eventType === 'report' ? (
                                 event.priority === 'critical' ? <AlertCircle size={18} /> : <FileText size={18} />
                              ) : (
                                 <Activity size={18} />
                              )}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">{event.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    {event.eventType === 'report' ? event.reportType : 'Clinical Vitals'}
                                 </span>
                                 <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                    {event.doctor || (event.eventType === 'vital' ? 'Self Recorded' : 'Clinic')}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{formatDate(event.date)}</p>
                           <ArrowRight size={14} className="ml-auto text-slate-200 group-hover:text-emerald-500 transition-all" />
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No health events recorded yet.</div>
               )}
            </div>
         </div>

         {/* Add Family Member Modal */}
         {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/40 backdrop-blur-sm">
               <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
                  <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="text-lg font-black text-slate-800">
                        Add New Member
                     </h3>
                     <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                        <X size={20} />
                     </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-none">
                     {error && <p className="p-4 bg-red-50 text-red-600 text-[10px] font-bold rounded-xl border border-red-100 uppercase tracking-widest">{error}</p>}
                     
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                        <input
                           required
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                           placeholder="e.g. Ahmed Ali"
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Relation *</label>
                           <select
                              required
                              value={formData.relation}
                              onChange={(e) => setFormData({...formData, relation: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                           >
                              {relations.map(rel => <option key={rel} value={rel}>{rel}</option>)}
                           </select>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age</label>
                           <input
                              type="number"
                              min="0"
                              max="120"
                              value={formData.age}
                              onChange={(e) => setFormData({...formData, age: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                              placeholder="e.g. 30"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                           <select
                              value={formData.gender}
                              onChange={(e) => setFormData({...formData, gender: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                           >
                              <option value="">Not specified</option>
                              {genders.map(g => <option key={g} value={g}>{g}</option>)}
                           </select>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                           <select
                              value={formData.bloodGroup}
                              onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                           >
                              <option value="">Not specified</option>
                              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                           </select>
                        </div>
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input
                           value={formData.phoneNumber}
                           onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                           placeholder="e.g. 0300-1234567"
                        />
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <input
                           type="email"
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                           placeholder="e.g. family@example.com"
                        />
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                        <input
                           value={formData.address}
                           onChange={(e) => setFormData({...formData, address: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                           placeholder=" House 5, Street 3, Lahore"
                        />
                     </div>

                     <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                        <KeyRound size={16} className="text-emerald-500 shrink-0" />
                        <p className="text-[9px] font-bold text-emerald-700 leading-relaxed tracking-wider">
                           A unique Patient ID and password will be auto-generated for this member.
                        </p>
                     </div>

                     <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg  transition-all active:scale-95"
                     >
                        Add Member
                     </button>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default Dashboard;
