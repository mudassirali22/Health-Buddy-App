import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border border-green-100/50">
      <div className="w-32 h-32 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <Heart className="text-5xl text-green-600" />
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
        Start Your Health Journey
      </h3>
      <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
        Track your vital signs and get AI-powered health insights to optimize your wellbeing
      </p>
      <Link
        to="/add-vitals"
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white  px-6 sm:px-10 py-4 rounded-2xl font-semibold inline-flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Plus className="w-6 h-6" />
        Record Your First Vitals
      </Link>
    </div>
  );
};

export default EmptyState;