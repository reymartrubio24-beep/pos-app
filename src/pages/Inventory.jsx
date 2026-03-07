import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import ProductTable from '../components/Inventory/ProductTable';
import ProductModal from '../components/Inventory/ProductModal';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', category: 'Snacks', price: '', stock: '', low_stock_threshold: '10' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

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
      setFormData({ name: '', category: 'Snacks', price: '', stock: '', low_stock_threshold: '10' });
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const result = await api.get(`/api/products/manage.php?action=delete&id=${id}`);
      if (result.success) {
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
        <button className="premium-btn" onClick={() => handleOpenModal()}>
          <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
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
        />
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        previewUrl={previewUrl}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Inventory;
