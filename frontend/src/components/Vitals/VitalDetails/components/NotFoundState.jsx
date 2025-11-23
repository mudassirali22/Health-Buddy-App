import { NavLink } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFoundState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Record Not Found</h2>
        <p className="text-gray-600 text-lg mb-8">The requested health record is unavailable</p>
        <NavLink
          to="/vitals"
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-10 py-4 rounded-2xl font-semibold inline-flex items-center gap-3 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Health Dashboard
        </NavLink>
      </div>
    </div>
  );
};

export default NotFoundState;