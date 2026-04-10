import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { PRODUCT_CATEGORIES } from '../utils/constants';
import ProductTable from '../components/Inventory/ProductTable';
import ProductModal from '../components/Inventory/ProductModal';
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
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Inventory Management</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '14px' }}>Maintain your stock and product records</p>
        </div>
        {(user?.role === 'owner' || user?.role === 'admin') && (
          <button className="premium-btn" onClick={() => handleOpenModal()}>
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        )}
      </div>

      <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ position: 'relative', width: '320px' }}>
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="input-field" 
                style={{ height: '40px', paddingLeft: '36px', fontSize: '13px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--slate-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
           </div>
        </div>

        <ProductTable 
          products={filteredProducts} 
          loading={loading} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
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
        handleSubmit={handleSubmit}
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
