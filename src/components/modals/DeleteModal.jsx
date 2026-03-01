import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ deleteConfirmation, setDeleteConfirmation, handleSoftDelete }) => {
  if (!deleteConfirmation.open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1A1A1D] rounded-lg shadow-xl max-w-sm w-full p-6 border-2 border-red-100 dark:border-red-900/30">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Product?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete <strong>{deleteConfirmation.product?.name}</strong>? This action will remove it from inventory and active carts.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setDeleteConfirmation({ open: false, product: null })}
              className="flex-1 py-2 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-[#27272a]"
            >
              Cancel
            </button>
            <button
              onClick={handleSoftDelete}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
