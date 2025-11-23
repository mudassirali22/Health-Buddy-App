import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../../services/api';
import { Plus,  Activity } from 'lucide-react';
import DeleteModal from './components/DeleteModal';
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
import { formatDate,} from './components/dateUtils';

const VitalsList = () => {
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

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const response = await api.get('/vitals');
      const sortedVitals = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setVitals(sortedVitals);
    } catch (error) {
      console.error('Error fetching vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Data Filtering and Sorting
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

  // Selection
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

  // Modal Functions
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
        setVitals(vitals.filter(v => v._id !== vitalId));
      } else {
        await Promise.all(
          Array.from(selectedVitals).map(id => api.delete(`/vitals/${id}`))
        );
        setVitals(vitals.filter(v => !selectedVitals.has(v._id)));
        setSelectedVitals(new Set());
      }
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting vital:', error);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  const stats = getComprehensiveStats(vitals);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <DeleteModal 
          deleteModal={deleteModal}
          selectedVitals={selectedVitals}
          onClose={closeDeleteModal}
          onDelete={handleDelete}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-15 h-15 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
                Health Vitals
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-lg flex items-center gap-2">
                Advanced health monitoring and analysis
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <NavLink
              to="/add-vitals"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              New Vitals
            </NavLink>
          </div>
        </div>

        {/* Stats Overview */}
        {vitals.length > 0 && stats && <StatsOverview stats={stats} vitals={vitals} />}

        {/* Controls Bar */}
        {vitals.length > 0 && (
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
        )}

        {/* Vitals List */}
        {vitals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {sortedVitals.map((vital, index) => {
              const analysis = getDetailedHealthAnalysis(vital);
              const previousVital = index < vitals.length - 1 ? vitals[index + 1] : null;
              const trend = getHealthTrend(vital, previousVital);
              const isSelected = selectedVitals.has(vital._id);
              
              return (
                <VitalsCard
                  key={vital._id}
                  vital={vital}
                  analysis={analysis}
                  trend={trend}
                  isSelected={isSelected}
                  onToggleSelection={() => toggleVitalSelection(vital._id)}
                  onDelete={() => openDeleteModal(vital._id, vital.date)}
                />
              );
            })}
          </div>
        )}

        {/* Health Insights Footer */}
        {vitals.length > 0 && stats && <HealthInsightsFooter stats={stats} />}
      </div>
    </div>
  );
};

export default VitalsList;