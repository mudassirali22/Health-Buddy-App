import { XCircle } from 'lucide-react';

const Error = ({ onNavigateHome }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="text-red-500 text-3xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h3>
        <p className="text-gray-600 mb-6">The requested report could not be loaded.</p>
        <button
          onClick={onNavigateHome}
          className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Error;