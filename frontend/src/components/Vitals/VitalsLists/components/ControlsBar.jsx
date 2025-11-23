import { Search, Trash2 } from 'lucide-react';

const ControlsBar = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  selectedVitals,
  sortedVitals,
  onSelectAll,
  onBulkDelete
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-gray-200/50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search records by date or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 border w-full sm:w-auto border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="needs attention">Needs Attention</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border w-full sm:w-auto border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
            <option value="metrics">Sort by Metrics</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {selectedVitals.size > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedVitals.size} selected
              </span>
              <button
                onClick={onBulkDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            </>
          )}
          <button
            onClick={onSelectAll}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all duration-200"
          >
            {selectedVitals.size === sortedVitals.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlsBar;