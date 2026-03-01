import React from 'react';
import { Plus, AlertTriangle, Upload, X, Trash2, Image as ImageIcon, History, Edit } from 'lucide-react';
import { getImageUrl } from '../../utils/formatters';

const ProductManagementView = ({
  auth,
  products,
  newProduct,
  setNewProduct,
  imagePreview,
  setImagePreview,
  onDrag,
  onDrop,
  dragActive,
  handleImageChange,
  fileInputRef,
  addNewProduct,
  setDeleteConfirmation,
  setEditImageModal,
  setEditProductModal,
  auditLogs,
  onClearLogs
}) => {
  return (
    <div className="space-y-6">
      {auth.role !== 'owner' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-6 py-3 rounded-lg flex items-center gap-3">
          <AlertTriangle size={20} className="shrink-0" />
          <span>You are in view-only mode. Please login as the owner using the button in the header to add, update, or delete products.</span>
        </div>
      )}
      <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 p-6 transition-colors duration-200">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Plus size={24} />
          Add New Product
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Name *</label>
            <input
              type="text"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Price (₱) *</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Barcode *</label>
            <input
              type="text"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              value={newProduct.barcode}
              onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
              placeholder="Enter barcode"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <input
              type="text"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              placeholder="Enter category"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Initial Stock</label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              placeholder="0"
            />
          </div>
          
          {/* Image Upload Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Image</label>
            <label 
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
                ${dragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'}`}
              onDragEnter={onDrag}
              onDragLeave={onDrag}
              onDragOver={onDrag}
              onDrop={onDrop}
              onClick={() => {
                if (!imagePreview && fileInputRef.current) fileInputRef.current.click();
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
              
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setNewProduct({ ...newProduct, image: null });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">JPEG, PNG, WebP up to 5MB</p>
                </div>
              )}
            </label>
          </div>
        </div>
        <button
          onClick={addNewProduct}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden transition-colors duration-200">
        <div className="bg-gray-50 dark:bg-[#1A1A1D] px-6 py-4 border-b-2 border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Product Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1A1A1D] border-b-2 border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Product ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Barcode</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map(product => !product.isDeleted && (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors">
                  <td className="px-6 py-4">
                    <div className="h-10 w-10 bg-gray-100 dark:bg-[#1A1A1D] rounded overflow-hidden flex items-center justify-center cursor-pointer group relative" onClick={() => setEditImageModal({ open: true, product, preview: product.image })}>
                      {product.image ? (
                        <img src={getImageUrl(product.image)} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                          <Edit size={16} className="text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-800 dark:text-gray-200">{product.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{product.category}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600 dark:text-gray-400">{product.barcode}</td>
                  <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">₱{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                      ${product.stock <= 0 ? 'bg-red-600 text-white' : 
                        product.stock <= 5 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                        'bg-gray-100 text-gray-700 dark:bg-[#27272a] dark:text-gray-300'}`}>
                      {product.stock <= 0 ? 'SOLD OUT' : (product.stock ?? 0)}
                      {product.stock > 0 && product.stock <= 5 && <AlertTriangle size={14} />}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {auth.role === 'owner' ? (
                        <>
                          <button
                            onClick={() => setEditProductModal({ open: true, product })}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                            title="Edit Details"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setEditImageModal({ open: true, product, preview: getImageUrl(product.image) })}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                            title="Update Image"
                          >
                            <ImageIcon size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation({ open: true, product })}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Owner only</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden transition-colors duration-200">
         <div className="bg-gray-50 dark:bg-[#1A1A1D] px-6 py-4 border-b-2 border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <History size={24} />
                Audit Log
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{auditLogs.length} records</span>
              <button 
                onClick={onClearLogs}
                className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
                title="Clear all logs"
              >
                Clear History
              </button>
            </div>
         </div>
         <div className="max-h-60 overflow-y-auto">
             {auditLogs.length === 0 ? (
                 <div className="p-8 text-center text-gray-400">No activity recorded yet</div>
             ) : (
                 <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-[#1A1A1D] sticky top-0">
                        <tr>
                            <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                            <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                            <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {auditLogs.map(log => (
                            <tr key={log.id} className="text-sm">
                                <td className="px-6 py-3 font-mono text-gray-600 dark:text-gray-400">
                                    {log.timestamp.toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-3 font-semibold text-gray-800 dark:text-gray-200">
                                    {log.action}
                                </td>
                                <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                                    {log.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
             )}
         </div>
      </div>
    </div>
  );
};

export default ProductManagementView;
