import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../../services/api';
import { Plus, Activity, RotateCw, AlertCircle } from 'lucide-react';
import { useFamily } from '../../../context/FamilyContext';
import ConfirmModal from '../../common/ConfirmModal';
import EmptyState from './components/EmptyState';
import StatsOverview from './components/StatsOverview';
import ControlsBar from './components/ControlsBar';
import HealthInsightsFooter from './components/HealthInsightsFooter';
import VitalsCard from './components/VitalsCard';
import LoadingState from './components/LoadingState';
import {
  getDetailedHealthAnalysis,
  getMetricCount,
  getHealthTrend,
  getComprehensiveStats
} from './components/healthAnalysis';
import { formatDate } from './components/dateUtils';

const VitalsList = () => {
  const { selectedFamilyMember } = useFamily();
    const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedVitals, setSelectedVitals] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    vitalId: null,
    vitalDate: '',
    type: 'single'
  });

  const fetchVitals = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const params = selectedFamilyMember ? { familyMember: selectedFamilyMember._id } : { familyMember: 'null' };
      const response = await api.get('/vitals', { params });
      const sortedVitals = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setVitals(sortedVitals);
    } catch (error) {
      console.error('Error fetching vitals:', error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals(true);
    const interval = setInterval(() => fetchVitals(false), 10000);
    return () => clearInterval(interval);
  }, [selectedFamilyMember]);

  const filteredVitals = vitals.filter(vital => {
    const matchesSearch = vital.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(vital.date).toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;

    const analysis = getDetailedHealthAnalysis(vital);
    return matchesSearch && analysis.status.toLowerCase().includes(filterStatus.toLowerCase());
  });

  const sortedVitals = [...filteredVitals].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'score':
        return getDetailedHealthAnalysis(b).overallScore - getDetailedHealthAnalysis(a).overallScore;
      case 'metrics':
        return getMetricCount(b) - getMetricCount(a);
      default:
        return 0;
    }
  });

  const toggleVitalSelection = (vitalId) => {
    const newSelected = new Set(selectedVitals);
    if (newSelected.has(vitalId)) {
      newSelected.delete(vitalId);
    } else {
      newSelected.add(vitalId);
    }
    setSelectedVitals(newSelected);
  };

  const selectAllVitals = () => {
    if (selectedVitals.size === sortedVitals.length) {
      setSelectedVitals(new Set());
    } else {
      setSelectedVitals(new Set(sortedVitals.map(v => v._id)));
    }
  };

  const openDeleteModal = (id, date, type = 'single') => {
    setDeleteModal({
      isOpen: true,
      vitalId: id,
      vitalDate: formatDate(date),
      type
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      vitalId: null,
      vitalDate: '',
      type: 'single'
    });
  };

  const handleDelete = async () => {
    const { vitalId, type } = deleteModal;
    try {
      if (type === 'single') {
        await api.delete(`/vitals/${vitalId}`);
        setVitals(prev => prev.filter(v => v._id !== vitalId));
              } else {
        await Promise.all(Array.from(selectedVitals).map(id => api.delete(`/vitals/${id}`)));
        setVitals(prev => prev.filter(v => !selectedVitals.has(v._id)));
        setSelectedVitals(new Set());
              }
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting vital:', error);
          }
  };

  if (loading) return <LoadingState />;

  const stats = getComprehensiveStats(vitals);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg ">
            <Activity size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2 uppercase">My Health Journey</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {selectedFamilyMember ? `Viewing ${selectedFamilyMember.name}'s health history` : "Track your vital signs and health progress."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <NavLink to="/add-vitals" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black transition-all shadow-lg  flex items-center gap-2 text-[10px] uppercase tracking-widest">
            <Plus size={18} /> Add New Record
          </NavLink>
        </div>
      </div>

      {vitals.length > 0 && stats && <StatsOverview stats={stats} vitals={vitals} />}

      <div className="space-y-6">
        {/* Controls Section */}
        <ControlsBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedVitals={selectedVitals}
          sortedVitals={sortedVitals}
          onSelectAll={selectAllVitals}
          onBulkDelete={() => openDeleteModal(null, null, 'multiple')}
        />

        {/* List Section */}
        {vitals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {sortedVitals.map((vital, index) => {
              const analysis = getDetailedHealthAnalysis(vital);
              const previousVital = index < vitals.length - 1 ? vitals[index + 1] : null;
              const trend = getHealthTrend(vital, previousVital);
              return (
                <VitalsCard
                  key={vital._id}
                  vital={vital}
                  analysis={analysis}
                  trend={trend}
                  isSelected={selectedVitals.has(vital._id)}
                  onToggleSelection={() => toggleVitalSelection(vital._id)}
                  onDelete={() => openDeleteModal(vital._id, vital.date)}
                />
              );
            })}
          </div>
        )}

        {vitals.length > 0 && stats && <HealthInsightsFooter stats={stats} />}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.type === 'multiple' ? 'Delete Multiple' : 'Delete Record'}
        message={deleteModal.type === 'multiple' 
          ? `Remove ${selectedVitals.size} records?` 
          : `Remove record from ${deleteModal.vitalDate}?`
        }
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        type="danger"
      />
    </div>
  );
};

export default VitalsList;