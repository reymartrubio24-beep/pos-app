import React from 'react';

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="animate-spin" style={{ width: '24px', height: '24px', border: '3px solid var(--slate-200)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto' }}></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--slate-400)' }}>
        No inventory matched your criteria
      </div>
    );
  }

  return (
    <div className="premium-table-container" style={{ border: 'none' }}>
      <table className="premium-table">
        <thead>
          <tr>
            <th style={{ paddingLeft: '24px' }}>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock Level</th>
            <th>Threshold</th>
            <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={{ paddingLeft: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   {p.image_url ? (
                     <img src={p.image_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', background: 'var(--slate-50)' }} />
                   ) : (
                     <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)' }}>
                       <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                     </div>
                   )}
                   <div>
                     <div style={{ fontWeight: '600', color: 'var(--slate-900)' }}>{p.name}</div>
                     <div style={{ fontSize: '11px', color: 'var(--slate-400)', fontWeight: '500' }}>#{p.id.toString().padStart(4, '0')}</div>
                   </div>
                </div>
              </td>
              <td>
                <span className="badge badge-info" style={{ fontWeight: '600' }}>{p.category}</span>
              </td>
              <td style={{ fontWeight: '700', color: 'var(--slate-900)' }}>₱{parseFloat(p.price).toLocaleString()}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <span className={`badge ${parseInt(p.stock) <= parseInt(p.low_stock_threshold) ? 'badge-danger' : 'badge-success'}`} style={{ fontWeight: '700' }}>
                     {p.stock}
                   </span>
                   <span style={{ fontSize: '12px', color: 'var(--slate-400)', fontWeight: '500' }}>units</span>
                </div>
              </td>
              <td style={{ color: 'var(--slate-500)', fontSize: '12px', fontWeight: '500' }}>{p.low_stock_threshold} min.</td>
              <td style={{ paddingRight: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                   <button onClick={() => onEdit(p)} style={{ border: 'none', background: 'var(--slate-100)', color: 'var(--slate-600)', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>Edit</button>
                   <button onClick={() => onDelete(p.id)} style={{ border: 'none', background: '#fee2e2', color: 'var(--danger)', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
