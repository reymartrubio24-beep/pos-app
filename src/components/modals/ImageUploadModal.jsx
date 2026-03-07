import React from 'react';
import { X, Image as ImageIcon, Upload } from 'lucide-react';
import { getImageUrl } from '../../utils/formatters';

const ImageUploadModal = ({
  editImageModal,
  setEditImageModal,
  handleUpdateImage
}) => {
  if (!editImageModal.open) return null;

  const onModalDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       const file = e.dataTransfer.files[0];
       const url = URL.createObjectURL(file);
       setEditImageModal(prev => ({ ...prev, preview: url, file }));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setEditImageModal(prev => ({ ...prev, preview: url, file }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1A1A1D] rounded-lg shadow-xl max-w-md w-full p-6 border-2 border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ImageIcon size={20} />
            Update Image
          </h3>
          <button onClick={() => setEditImageModal({ open: false, product: null, preview: null })} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
           <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Product: <strong>{editImageModal.product?.name}</strong></p>
           
           <label 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 dark:bg-[#27272a]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onModalDrop}
           >
             <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleFileSelect} />
             
             {editImageModal.preview ? (
               <img src={getImageUrl(editImageModal.preview)} alt="Preview" className="h-40 w-40 object-contain rounded-lg mb-2" />
             ) : (
               <Upload className="h-12 w-12 text-gray-400 mb-2" />
             )}
             
             <p className="text-sm text-center text-gray-500">
               {editImageModal.preview ? 'Click or drag to change' : 'Drag image here or click to browse'}
             </p>
             <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP (Max 5MB)</p>
           </label>
        </div>

        <div className="flex justify-end gap-3">
           <button
              onClick={() => setEditImageModal({ open: false, product: null, preview: null })}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#27272a] rounded-lg"
            >
              Cancel
            </button>
            <button
              disabled={!editImageModal.file}
              onClick={() => handleUpdateImage(editImageModal.file)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
