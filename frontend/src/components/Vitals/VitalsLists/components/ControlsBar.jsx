import { Search, Trash2, CheckSquare, Filter, LayoutGrid, ChevronDown } from 'lucide-react';

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
    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
      {/* Search Input */}
      <div className="flex-1 standard-card p-2 flex items-center gap-3 group focus-within:border-emerald-500 transition-all">
        <Search className="ml-3 text-emerald-500 transition-transform group-focus-within:scale-110" size={18} />
        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none py-2.5 text-sm focus:ring-0 outline-none font-bold text-slate-700 placeholder:text-slate-400 uppercase tracking-tight"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filter Dropdown */}
        <div className="standard-card relative flex items-center bg-white group hover:border-emerald-200 transition-all overflow-hidden">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-transparent border-none py-3 pl-4 pr-10 text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none"
          >
            <option value="all">All Results</option>
            <option value="excellent">Healthy / Normal</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="needs attention">Needs Checkup</option>
            <option value="critical">Critical</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="standard-card relative flex items-center bg-white group hover:border-emerald-200 transition-all overflow-hidden">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-transparent border-none py-3 pl-4 pr-10 text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none"
          >
            <option value="date">Newest First</option>
            <option value="score">Health Score</option>
            <option value="metrics">Most Data</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Bulk Actions - Show only when items are selected */}
        {selectedVitals.size > 0 && (
          <div className="flex gap-2">
            <button
              onClick={onSelectAll}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-lg "
            >
              Clear Selection
            </button>
            <button
              onClick={onBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl transition-all shadow-lg  flex items-center justify-center"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlsBar;