const NavigationTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-between space-x-1 mb-6 bg-emerald-100 backdrop-blur-sm rounded-2xl p-1 sm:p-2 border border-emerald-200">
      {['overview', 'metrics', 'insights', 'trends', 'actions'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 text-xs sm:text-sm md:text-base py-2 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 ${
            activeTab === tab
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
            : 'text-gray-600 hover:text-emerald-700 hover:bg-white/50'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default NavigationTabs;