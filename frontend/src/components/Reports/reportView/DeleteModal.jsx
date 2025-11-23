import { AlertTriangle, CheckCircle, X, Trash2 } from 'lucide-react';

const DeleteModal = ({ 
  isOpen, 
  showSuccess, 
  showError, 
  errorMessage, 
  report, 
  deleting, 
  onClose, 
  onDelete 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Medical Report</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {showSuccess ? (
            <SuccessView />
          ) : showError ? (
            <ErrorView errorMessage={errorMessage} />
          ) : (
            <DeleteConfirmationView report={report} />
          )}
        </div>

        {/* Footer */}
        {!showSuccess && !showError && (
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Report
                </>
              )}
            </button>
          </div>
        )}

        {showSuccess && (
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
            >
              Close
            </button>
          </div>
        )}

        {showError && (
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
            >
              Close
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SuccessView = () => (
  <div className="text-center py-4">
    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <CheckCircle className="w-6 h-6 text-green-600" />
    </div>
    <h4 className="text-lg font-semibold text-gray-900 mb-2">Successfully Deleted!</h4>
    <p className="text-gray-600">The report has been removed.</p>
  </div>
);

const ErrorView = ({ errorMessage }) => (
  <div className="text-center py-4">
    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <X className="w-6 h-6 text-red-600" />
    </div>
    <h4 className="text-lg font-semibold text-gray-900 mb-2">Deletion Failed</h4>
    <p className="text-gray-600">{errorMessage}</p>
  </div>
);

const DeleteConfirmationView = ({ report }) => (
  <>
    <p className="text-gray-700 mb-4">
      Are you sure you want to delete the report{' '}
      <span className="font-semibold text-gray-900">"{report?.title}"</span>?
    </p>
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 text-red-700">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">This will permanently delete this medical report</span>
      </div>
    </div>
  </>
);

export default DeleteModal;