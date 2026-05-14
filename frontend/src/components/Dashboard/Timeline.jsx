import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { useFamily } from '../../context/FamilyContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Activity,
  Calendar,
  Search,
  Sparkles,
  ArrowRight,
  Filter,
  Clock,
  History,
  TrendingUp,
  Thermometer,
  Droplets,
  Zap,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Heart,
  Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Timeline = () => {
  const { selectedFamilyMember } = useFamily();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimelineData(true);
    const interval = setInterval(() => fetchTimelineData(false), 10000);
    return () => clearInterval(interval);
  }, [selectedFamilyMember]);

  const fetchTimelineData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const params = selectedFamilyMember ? { familyMember: selectedFamilyMember._id } : { familyMember: 'null' };
      const [reportsRes, vitalsRes] = await Promise.all([
        api.get('/reports', { params }),
        api.get('/vitals', { params })
      ]);

      const reports = (reportsRes.data.data || []).map(r => ({
        ...r,
        type: 'report',
        timestamp: new Date(r.date)
      }));

      const vitals = (vitalsRes.data.data || []).map(v => ({
        ...v,
        type: 'vital',
        timestamp: new Date(v.date)
      }));

      const combined = [...reports, ...vitals].sort((a, b) => b.timestamp - a.timestamp);
      setItems(combined);
    } catch (error) {
      console.error('Timeline fetch error:', error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const matchesSearch = 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.reportType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [items, filter, searchTerm]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] animate-pulse">Retrieving Health Timeline...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Banner - Dashboard Style */}
      <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-md  flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-600 from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-lg ">
            <History size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2 uppercase">My Health Archive</h1>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               {selectedFamilyMember ? `Recent logs for ${selectedFamilyMember.name}` : 'A complete history of your medical scans and vitals'}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
            <input 
              type="text" 
              placeholder="Search health events..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/10 outline-none w-full sm:w-64 transition-all"
            />
          </div>
          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
            {['all', 'report', 'vital'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-emerald-600 text-white shadow-md ' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f}s
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Stats Row - Dashboard Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-slate-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Records</p>
               <h3 className="text-3xl font-black">{items.length}</h3>
            </div>
            <History className="absolute bottom-[-10px] right-[-10px] text-white/5 group-hover:scale-110 transition-transform" size={80} />
         </div>
         <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md  flex items-center justify-between">
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Medical Scans</p>
               <h3 className="text-3xl font-black text-slate-800">{items.filter(i => i.type === 'report').length}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
               <FileText size={24} />
            </div>
         </div>
         <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md  flex items-center justify-between">
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Vital Checks</p>
               <h3 className="text-3xl font-black text-slate-800">{items.filter(i => i.type === 'vital').length}</h3>
            </div>
            <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center border border-slate-100">
               <Activity size={24} />
            </div>
         </div>
         <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-md  flex items-center justify-between">
            <div>
               <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Health Priority</p>
               <h3 className="text-lg font-black uppercase tracking-tighter">AI Analysis</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
               <Zap size={24} />
            </div>
         </div>
      </div>

      {/* Timeline List */}
      <div className="relative pb-24">
        {/* Central Spine */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-emerald-600 from-emerald-500 via-slate-200 to-transparent -translate-x-1/2 opacity-30 rounded-full"></div>

        <div className="space-y-20 relative">
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-32 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-md  mx-auto max-w-2xl"
              >
                 <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300 mb-8 shadow-inner">
                    <Search size={48} />
                 </div>
                 <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-3">No History Found</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-xs mx-auto opacity-70 leading-relaxed">We couldn't find any health events in your archive. Start by adding a report or vitals.</p>
              </motion.div>
            ) : (
              filteredItems.map((item, idx) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.3) }}
                  className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  
                  {/* Date Tag */}
                  <div className="hidden md:flex flex-1 justify-center">
                     <div className="bg-slate-800 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg  flex items-center gap-3">
                        <Calendar size={16} className="text-emerald-400" />
                        {formatDate(item.date)}
                     </div>
                  </div>

                  {/* Visual Node */}
                  <div className="absolute left-6 md:left-1/2 w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-[1.25rem] border-4 md:border-[6px] border-slate-50 flex items-center justify-center -translate-x-1/2 z-10 shadow-md group cursor-pointer" onClick={() => navigate(item.type === 'report' ? `/report/${item._id}` : `/vitals`)}>
                     <div className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${item.type === 'report' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'}`}>
                        {item.type === 'report' ? <FileText className="w-5 h-5 md:w-6 md:h-6" /> : <Activity className="w-5 h-5 md:w-6 md:h-6" />}
                     </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 w-full pl-16 md:pl-0">
                    <div 
                      onClick={() => navigate(item.type === 'report' ? `/report/${item._id}` : `/vitals`)}
                      className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 shadow-lg cursor-pointer group relative overflow-hidden hover:border-emerald-500 transition-all duration-500"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:bg-emerald-50 transition-colors"></div>
                      
                      <div className="flex items-center justify-between mb-5 md:mb-8 relative z-10">
                         <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 md:px-4 md:py-1.5 rounded-xl shadow-sm ${item.type === 'report' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'}`}>
                               {item.type === 'report' ? 'Medical Scan' : 'Health Vitals'}
                            </span>
                            {item.reportType && (
                              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.reportType}</span>
                            )}
                         </div>
                         <div className="flex items-center gap-1.5 md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-xl">
                            <Calendar size={12} className="text-emerald-500" /> {formatDate(item.date)}
                         </div>
                      </div>

                      <h3 className="text-lg md:text-3xl font-black text-slate-800 mb-6 md:mb-8 group-hover:text-emerald-600 transition-colors tracking-tight uppercase leading-[1.1] md:leading-[0.9] relative z-10 max-w-[90%] md:max-w-[80%]">
                         {item.type === 'report' ? item.title : 'Routine Health Check-up'}
                      </h3>

                      {item.type === 'vital' ? (
                        <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 relative z-10">
                           {[
                             { label: 'Pulse', value: item.heartRate ? `${item.heartRate} BPM` : 'N/A', icon: Heart, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                             { label: 'Pressure', value: item.bloodPressure ? `${item.bloodPressure.systolic}/${item.bloodPressure.diastolic}` : 'N/A', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
                             { label: 'Glucose', value: item.bloodSugar ? `${item.bloodSugar} mg/dL` : 'N/A', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
                             { label: 'Weight', value: item.weight ? `${item.weight} kg` : 'N/A', icon: Scale, color: 'text-purple-500', bg: 'bg-purple-50' }
                           ].map(vital => (
                             <div key={vital.label} className="bg-slate-50/80 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group/v">
                                <div className="flex items-center justify-between mb-3 md:mb-4">
                                   <div className={`w-8 h-8 md:w-10 md:h-10 ${vital.bg} rounded-xl flex items-center justify-center ${vital.color}`}>
                                      <vital.icon className="w-4 h-4 md:w-5 md:h-5" />
                                   </div>
                                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover/v:opacity-100 transition-opacity"></div>
                                </div>
                                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{vital.label}</p>
                                <p className="text-sm md:text-lg font-black text-slate-800 truncate">{vital.value}</p>
                             </div>
                           ))}
                        </div>
                        <div className="flex items-center justify-end gap-2 text-emerald-600 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] mt-6 md:mt-8 group-hover:gap-3 transition-all">
                           View Full Record <ArrowRight size={14} className="md:w-4 md:h-4" />
                        </div>
                      </>
                      ) : (
                        <div className="space-y-4 md:space-y-6 relative z-10">
                           <div className="p-4 md:p-6 bg-slate-800 rounded-2xl md:rounded-3xl text-slate-300 text-xs md:text-sm font-medium leading-relaxed italic border border-slate-700 shadow-lg relative">
                              <Sparkles className="absolute top-3 md:top-4 right-3 md:right-4 text-emerald-500/30 w-5 h-5 md:w-6 md:h-6" />
                              <p className="line-clamp-3 md:line-clamp-none pr-6 md:pr-8">
                                {typeof item.aiSummary === 'string' ? item.aiSummary : (item.aiSummary?.english || item.aiSummary?.mainObservations?.[0] || 'Report analysis processed successfully...')}
                              </p>
                           </div>
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
                              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                                 <div className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest ${
                                   item.priority === 'critical' ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm' :
                                   item.priority === 'abnormal' ? 'bg-amber-50 text-amber-600 border border-amber-100 shadow-sm' :
                                   'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm'
                                 }`}>
                                    {item.priority || 'Normal'}
                                 </div>
                                 <span className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-100 pl-2 md:pl-4">Provider: {item.doctor || 'AI'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-emerald-600 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] group-hover:gap-3 transition-all self-end sm:self-auto">
                                 View Details <ArrowRight size={14} className="md:w-4 md:h-4" />
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Timeline;