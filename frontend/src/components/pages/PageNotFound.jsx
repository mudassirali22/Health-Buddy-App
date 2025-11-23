import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, ArrowLeft, Heart } from 'lucide-react';

const PageNotFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden transform hover:shadow-xl transition-all duration-300">
          
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 w-full"></div>
          
          <div className="p-8">
            <div className="relative mb-6">
              <div className="text-7xl font-bold pl-20 sm:pl-30 text-green-600 mb-2  relative">
                404
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-green-300 to-emerald-300 mx-auto rounded-full"></div>
            </div>

            {/* Message Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Page Not Found
              </h2>
              <p className="text-gray-600 leading-relaxed">
                  The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <NavLink
                to={user ? "/dashboard" : "/"}
                className="flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold group"
              >
                <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                {user ? "Back to Dashboard" : "Go to Homepage"}
              </NavLink>

              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-full text-green-600 hover:text-emerald-700 px-6 py-3 rounded-lg border-2 border-green-200 hover:border-green-300 transition-all duration-300 font-medium group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Return to Previous Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;