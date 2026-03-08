import React from 'react';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const ProductModal = ({ 
  isOpen, 
  onClose, 
  editingProduct, 
  formData, 
  setFormData, 
  previewUrl, 
  handleFileChange, 
  handleSubmit,
  categories = PRODUCT_CATEGORIES
}) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="premium-card" style={{ maxWidth: '480px', width: '90%', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>{editingProduct ? 'Edit Product' : 'New Product'}</h2>
            <p style={{ fontSize: '13px', color: 'var(--slate-500)', marginTop: '2px' }}>Fill in the product details below</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--slate-50)', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '8px' }}>Product Image</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--slate-50)', border: '2px dashed var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {previewUrl ? (
                     <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                     <svg style={{ width: '32px', height: '32px', color: 'var(--slate-300)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                  )}
               </div>
               <div style={{ flex: 1 }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="product-image-upload"
                  />
                  <label 
                    htmlFor="product-image-upload"
                    className="premium-btn"
                    style={{ background: 'white', color: 'var(--slate-700)', border: '1px solid var(--border-main)', padding: '0 16px', height: '40px', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', width: 'auto', boxShadow: 'none' }}
                  >
                     <svg style={{ width: '18px', height: '18px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                     </svg>
                     {previewUrl ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  <p style={{ fontSize: '11px', color: 'var(--slate-400)', marginTop: '8px' }}>Recommended: Square image, max 2MB</p>
               </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '8px' }}>Product Name</label>
            <input type="text" className="input-field" placeholder="e.g. Gardenia Whole Wheat Bread" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px', marginBottom: '20px' }}>
            <div>
               <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '8px' }}>Category</label>
               <input 
                  list="category-suggestions"
                  className="input-field" 
                  placeholder="Select or type category"
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
               />
               <datalist id="category-suggestions">
                  {categories.map(c => (
                     <option key={c} value={c} />
                  ))}
               </datalist>
            </div>
            <div>
               <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '8px' }}>Price (₱)</label>
               <input type="number" step="0.01" className="input-field" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div>
               <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '8px' }}>Current Stock</label>
               <input type="number" className="input-field" placeholder="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
            </div>
            <div>
               <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '8px' }}>Low Stock Alert</label>
               <input type="number" className="input-field" value={formData.low_stock_threshold} onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })} required />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="premium-btn" style={{ flex: 1, background: 'var(--slate-50)', color: 'var(--slate-600)', border: '1px solid var(--border-main)', boxShadow: 'none' }} onClick={onClose}>Cancel</button>
            <button type="submit" className="premium-btn" style={{ flex: 1.5 }}>
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
