const NavigationTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex overflow-x-auto scrollbar-none justify-start sm:justify-between items-center gap-1 mb-6 bg-emerald-100/50 backdrop-blur-sm rounded-2xl p-1.5 border border-emerald-200">
      {['overview', 'metrics', 'insights', 'trends', 'actions'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`whitespace-nowrap flex-1 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
            activeTab === tab
            ? 'bg-emerald-600 text-white shadow-lg'
            : 'text-emerald-700/60 hover:text-emerald-700 hover:bg-white/50'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default NavigationTabs;