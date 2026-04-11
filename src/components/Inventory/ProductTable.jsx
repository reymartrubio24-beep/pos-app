import React from 'react';

const ProductTable = ({ products, loading, onEdit, onDelete, onViewHistory, user }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="animate-spin" style={{ width: '24px', height: '24px', border: '3px solid var(--slate-200)', borderTop: '4px solid var(--primary)', borderRadius: '50%', margin: '0 auto' }}></div>
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
            <th style={{ paddingLeft: '24px', color: 'var(--slate-600)' }}>Product</th>
            <th style={{ color: 'var(--slate-600)' }}>Category</th>
            <th style={{ color: 'var(--slate-600)' }}>Price</th>
            <th style={{ color: 'var(--slate-600)' }}>Stock Level</th>
            <th style={{ color: 'var(--slate-600)' }}>Threshold</th>
            <th style={{ textAlign: 'center', color: 'var(--slate-600)' }}>Restock Status</th>
            <th style={{ textAlign: 'right', paddingRight: '24px', color: 'var(--slate-600)' }}>
              {(user?.role === 'owner' || user?.role === 'admin') ? 'Actions' : ''}
            </th>
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
                     <div style={{ fontWeight: '700', color: 'var(--slate-900)', fontSize: '15px' }}>{p.name}</div>
                     <div style={{ fontSize: '11px', color: 'var(--slate-500)', fontWeight: '600' }}>#{p.id.toString().padStart(4, '0')}</div>
                   </div>
                </div>
              </td>
              <td>
                <span className={`product-category-badge cat-${p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`} style={{ fontWeight: '800' }}>
                  {p.category}
                </span>
              </td>
              <td style={{ fontWeight: '800', color: 'var(--slate-900)', fontSize: '15px' }}>₱{parseFloat(p.price).toLocaleString()}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <span className={`badge ${parseInt(p.stock) <= parseInt(p.low_stock_threshold) ? 'badge-danger' : 'badge-success'}`} style={{ fontWeight: '800', fontSize: '14px', padding: '4px 10px' }}>
                     {p.stock}
                   </span>
                   <span style={{ fontSize: '13px', color: 'var(--slate-600)', fontWeight: '600' }}>stock</span>
                </div>
              </td>
              <td style={{ color: 'var(--slate-600)', fontSize: '13px', fontWeight: '600' }}>{p.low_stock_threshold} Low Stock</td>
              <td style={{ textAlign: 'center' }}>
                <div onClick={() => onViewHistory(p)} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} className="history-trigger">
                  {p.last_restock ? (
                      <div style={{ 
                        fontSize: '10px', 
                        background: 'rgba(16, 185, 129, 0.08)', 
                        padding: '6px 14px', 
                        borderRadius: '10px', 
                        border: '1px solid rgba(16, 185, 129, 0.3)', 
                        textAlign: 'center',
                        display: 'inline-block',
                        minWidth: '150px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                           <span style={{ fontWeight: '900', color: 'var(--success)', fontSize: '12px' }}>+{p.last_stock_added}</span>
                           <span style={{ fontSize: '9px', color: 'var(--slate-700)', fontWeight: '800', textTransform: 'uppercase' }}>Restock</span>
                        </div>
                        {p.last_stock_before !== null && p.last_stock_before !== undefined && (
                           <div style={{ fontSize: '9px', color: 'var(--slate-500)', fontWeight: '700', marginBottom: '3px' }}>
                             (Prev: {p.last_stock_before})
                           </div>
                        )}
                        <div style={{ fontSize: '10px', color: 'var(--slate-600)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                           <svg style={{ width: '10px', height: '10px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                           {new Date(p.last_restock).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                        </div>
                      </div>
                  ) : (
                      <span style={{ fontSize: '12px', color: 'var(--slate-400)', fontStyle: 'italic', fontWeight: '500' }}>No activity</span>
                  )}
                </div>
              </td>
              <td style={{ paddingRight: '24px' }}>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>

                    {(user?.role === 'owner' || user?.role === 'admin') && (
                      <button onClick={() => onEdit(p)} style={{ border: '1px solid var(--border-main)', background: 'var(--slate-100)', color: 'var(--slate-700)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Edit</button>
                    )}
                    {(user?.role === 'owner' || user?.role === 'admin') && (
                      <button onClick={() => onDelete(p.id)} style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: '#fee2e2', color: 'var(--danger)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Delete</button>
                    )}
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
