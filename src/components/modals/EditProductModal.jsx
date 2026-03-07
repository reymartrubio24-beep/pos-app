import React, { useState, useEffect } from 'react';
import { X, Save, Package, DollarSign, Barcode, Layers, Calculator } from 'lucide-react';

const EditProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    barcode: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        barcode: product.barcode || '',
        category: product.category || '',
        stock: product.stock || 0
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product.id, {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A1A1D] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 transform animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Package size={24} />
            Edit Product Details
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Package size={16} className="text-blue-500" />
              Product Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-green-500" />
                Price (₱)
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calculator size={16} className="text-orange-500" />
                Stock Level
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Barcode size={16} className="text-purple-500" />
              Barcode
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Layers size={16} className="text-cyan-500" />
              Category
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
