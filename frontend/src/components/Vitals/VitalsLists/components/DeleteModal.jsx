import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteModal = ({ deleteModal, selectedVitals, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {deleteModal.type === 'multiple' ? 'Delete Multiple Records' : 'Delete Vital Record'}
              </h3>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            {deleteModal.type === 'multiple' 
              ? `Are you sure you want to delete ${selectedVitals.size} selected records?`
              : `Are you sure you want to delete the vital record from ${deleteModal.vitalDate}?`
            }
          </p>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">All data will be permanently removed</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            {deleteModal.type === 'multiple' ? `Delete ${selectedVitals.size} Records` : 'Delete Record'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;