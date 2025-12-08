import { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../services/api';
import { 
  FaFileMedical, 
  FaFilter, 
  FaCalendarAlt, 
  FaStethoscope, 
  FaArrowRight,
  FaSearch,
  FaSort,
  FaTrash,
  FaCloudUploadAlt,
  FaSync,
  FaExclamationTriangle,
  FaTimes,
} from 'react-icons/fa';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedReports, setSelectedReports] = useState(new Set());
  const [bulkActions, setBulkActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports');
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports.filter(report => {
      const matchesFilter = filter === 'all' || report.reportType === filter;
      const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.reportType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.aiSummary?.english?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title?.toLowerCase();
          bValue = b.title?.toLowerCase();
          break;
        case 'type':
          aValue = a.reportType?.toLowerCase();
          bValue = b.reportType?.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [reports, filter, searchTerm, sortBy, sortOrder]);

  const reportTypes = useMemo(() => {
    const types = [...new Set(reports.map(r => r.reportType))];
    return types.map(type => ({
      name: type,
      count: reports.filter(r => r.reportType === type).length,
      icon: <FaStethoscope />
    }));
  }, [reports]);

  const toggleReportSelection = (reportId) => {
    const newSelected = new Set(selectedReports);
    if (newSelected.has(reportId)) {
      newSelected.delete(reportId);
    } else {
      newSelected.add(reportId);
    }
    setSelectedReports(newSelected);
    setBulkActions(newSelected.size > 0);
  };

  const selectAllReports = () => {
    if (selectedReports.size === filteredAndSortedReports.length) {
      setSelectedReports(new Set());
      setBulkActions(false);
    } else {
      setSelectedReports(new Set(filteredAndSortedReports.map(r => r._id)));
      setBulkActions(true);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedReports).map(id => 
          api.delete(`/reports/${id}`)
        )
      );
      setSelectedReports(new Set());
      setBulkActions(false);
      setShowDeleteModal(false);
      fetchReports();
    } catch (error) {
      console.error('Error deleting reports:', error);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  //  Confirm Modal Component
  const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm  flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-lg" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <FaTimes className="text-gray-600 text-sm" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <FaTrash className="text-sm" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center overflow-hidden">
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="w-16 h-16 border-4 border-green-400 border-b-transparent rounded-full animate-spin animate-reverse absolute top-2 left-1/2 -translate-x-1/2"></div>
            <FaFileMedical className="absolute inset-0 m-auto text-emerald-600 text-2xl animate-pulse" />
          </div>
          <div className="space-y-3">
            <p className="text-xl text-gray-700 font-medium">
              Loading your medical reports...
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
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleBulkDelete}
        title="Delete Reports"
        message={`Are you sure you want to delete ${selectedReports.size} report${selectedReports.size > 1 ? 's' : ''}? This action cannot be undone.`}
      />

      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4 mb-6 lg:mb-0">
            <div className="relative">
              <div className=" w-14 sm:w-14 h-13 sm:h-15 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/25">
                <FaFileMedical className="text-2xl text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-4 border-white flex items-center justify-center">
                <span className="text-xs text-white font-bold">{reports.length}</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Medical Reports
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-lg">All your medical reports in one secure place</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={fetchReports}
              className="bg-white text-green-600 border border-green-300 px-6 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <FaSync className="text-md sm:text-lg" />
              Refresh
            </button>
            
            <NavLink to="/upload-report">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <FaCloudUploadAlt className="text-md sm:text-lg" />
                Upload Report
              </div>
            </NavLink>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border border-green-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-green-500" />
              </div>
              <input
                type="text"
                placeholder="Search reports by title, type, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-green-50 border border-green-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-green-50 border border-green-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="type">Sort by Type</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-green-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <FaSort className="text-md sm:text-lg" />
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <FaFilter className="text-green-600 text-md sm:text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Filter Reports</h2>
            </div>
            
            <div className="grid grid-cols-2 text-sm sm:text-md sm:flex sm:flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`sm:px-6 sm:py-2 p-2 rounded-xl font-semibold transition-all duration-300 flex flex-col sm:flex-row items-center gap-2 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                <FaFileMedical />
                All Reports ({reports.length})
              </button>
              
              {reportTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => setFilter(type.name)}
                  className={`px-3 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex flex-col sm:flex-row items-center gap-2 ${
                    filter === type.name
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {type.icon}
                  {type.name} ({type.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {bulkActions && (
          <div className="bg-gradient-to-r from-red-500 to-amber-700 rounded-2xl shadow-xl p-6 mb-6 text-white transition-all duration-300">
            <div className="flex items-center flex-col sm:flex-row justify-between">
              <div className="flex items-center py-2 gap-2">
                <FaExclamationTriangle className="text-sm sm:text-2xl" />
                <div>
                  <h3 className="font-bold text-md sm:text-lg">{selectedReports.size} reports selected</h3>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={selectAllReports}
                  className="bg-white/20 hover:bg-white/30 px-4 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 backdrop-blur-sm hover:scale-105"
                >
                  Select all
                </button>
                <button
                  onClick={openDeleteModal}
                  className="bg-white/20 hover:bg-white/30 px-4 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 backdrop-blur-sm hover:scale-105"
                >
                  <FaTrash />
                  Delete
                </button>
                <button
                  onClick={() => { setSelectedReports(new Set()); setBulkActions(false); }}
                  className="bg-white/20 hover:bg-white/30 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports Grid */}
        {filteredAndSortedReports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border border-green-100 transition-all duration-300">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFileMedical className="text-3xl sm:text-4xl text-green-600" />
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3">
              {searchTerm ? 'No matching reports found' : 'No Reports Found'}
            </h3>
            <p className="text-gray-600 text-md sm:text-lg mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Start by uploading your first medical report to track your health journey securely.'
              }
            </p>
            <div className="flex gap-4 justify-center">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Clear Search
                </button>
              )}
              <NavLink to="/upload-report">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 sm:px-8 sm:py-4 py-3 rounded-2xl font-semibold inline-flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <FaCloudUploadAlt className="text-lg" />
                  Upload Your First Report
                </div>
              </NavLink>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedReports.map((report, index) => (
              <div
                key={report._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300 group cursor-pointer transform hover:-translate-y-1 relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4">
                  <input
                    type="checkbox"
                    checked={selectedReports.has(report._id)}
                    onChange={() => toggleReportSelection(report._id)}
                    className="w-5 h-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                  />
                </div>

                {/* Report Header */}
                <div className="flex justify-end mb-4 pl-6">
                  <div className="flex flex-col items-end gap-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {report.reportType}
                    </span>
                  </div>
                </div>

                {/* Report Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                    {report.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-green-500" />
                      <span className="text-sm font-medium">{formatDate(report.date)}</span>
                    </div>
                    <span className="text-xs text-gray-500">{getTimeAgo(report.date)}</span>
                  </div>

                  {report.aiSummary?.english && (
                    <p className="text-sm text-gray-600 line-clamp-3 bg-green-50 rounded-lg p-3 border border-green-100">
                      {report.aiSummary.english}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <NavLink 
                    to={`/report/${report._id}`}
                    className="text-green-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
                  >
                    View Details
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {filteredAndSortedReports.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-6 text-white transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Report Summary</h3>
                <p className="text-green-100">
                  Showing {filteredAndSortedReports.length} of {reports.length} total reports
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
              <div className="flex gap-6 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold">{reports.length}</div>
                  <div className="text-green-100 text-sm">Total Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{reportTypes.length}</div>
                  <div className="text-green-100 text-sm">Report Types</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {reports.length > 0 ? formatDate(reports[0].date) : 'N/A'}
                  </div>
                  <div className="text-green-100 text-sm">Latest Report</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportList;