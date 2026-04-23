import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { PRODUCT_CATEGORIES } from '../utils/constants';
import ProductTable from '../components/Inventory/ProductTable';
import ProductModal from '../components/Inventory/ProductModal';
import HistoryModal from '../components/Inventory/HistoryModal';
import ConfirmModal from '../components/Common/ConfirmModal';

const Inventory = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', category: '', price: '', stock: '', low_stock_threshold: '10' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  
  // History state
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryProduct, setSelectedHistoryProduct] = useState(null);
  
  // Confirmation state
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [categories, setCategories] = useState(PRODUCT_CATEGORIES);
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const dbCategories = await api.get('/api/products/categories.php');
      const combined = Array.from(new Set([...PRODUCT_CATEGORIES, ...dbCategories]));
      setCategories(combined);
    } catch (err) {
      console.error('Failed to categories', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/products/index.php');
      setProducts(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ 
        name: product.name, 
        category: product.category, 
        price: product.price, 
        stock: product.stock, 
        low_stock_threshold: product.low_stock_threshold
      });
      setPreviewUrl(product.image_url || '');
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: '', stock: '', low_stock_threshold: '10' });
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setRemoveImage(false);
    setIsModalOpen(true);
  };

  const handleOpenHistory = (product = null) => {
    setSelectedHistoryProduct(product);
    setShowHistory(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setRemoveImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = editingProduct ? 'update' : 'create';
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('low_stock_threshold', formData.low_stock_threshold);
    if (selectedFile) data.append('image', selectedFile);
    if (removeImage) data.append('remove_image', 'true');
    if (editingProduct) data.append('id', editingProduct.id);

    try {
      const result = await api.upload(`/api/products/manage.php?action=${action}`, data);
      if (result.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert('Operation failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Operation failed: ' + err.message);
    }
  };

   const handleDelete = (id) => {
    const product = products.find(p => p.id === id);
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const result = await api.get(`/api/products/manage.php?action=delete&id=${productToDelete.id}`);
      if (result.success) {
        setShowConfirm(false);
        setProductToDelete(null);
        fetchProducts();
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Inventory Management</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '14px', fontWeight: '500' }}>Maintain your stock and product records</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          {(user?.role === 'owner' || user?.role === 'admin') && (
            <button 
              className="secondary-btn" 
              onClick={() => window.location.href = '/api/products/export_inventory.php'}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 18px',
                fontWeight: '700',
                fontSize: '13px',
                borderRadius: '12px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-main)',
                color: 'var(--slate-700)'
              }}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          )}

          <button 
            className="secondary-btn" 
            onClick={() => handleOpenHistory(null)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 18px',
              fontWeight: '700',
              fontSize: '13px',
              borderRadius: '12px'
            }}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Stock History
          </button>

          {(user?.role === 'owner' || user?.role === 'admin') && (
            <button className="premium-btn" onClick={() => handleOpenModal()} style={{ padding: '10px 18px', borderRadius: '12px' }}>
              <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          )}
        </div>
      </div>

      <div className="premium-card" style={{ padding: 0, overflow: 'hidden', boxShadow: 'var(--card-shadow-md)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="input-field" 
                style={{ height: '44px', paddingLeft: '40px', fontSize: '14px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--slate-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
        </div>

        <ProductTable 
          products={filteredProducts} 
          loading={loading} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
          onViewHistory={handleOpenHistory}
          user={user}
        />
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        previewUrl={previewUrl}
        categories={categories}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        handleSubmit={handleSubmit}
      />

      <HistoryModal 
        show={showHistory}
        onClose={() => setShowHistory(false)}
        product={selectedHistoryProduct}
        user={user}
      />

      <ConfirmModal 
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${productToDelete?.name}?`}
        message="This product will be permanently removed from the inventory. This action cannot be undone."
      />
    </div>
  );
};

export default Inventory;
