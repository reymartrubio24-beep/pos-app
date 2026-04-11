import React from 'react';

const RestockTable = ({ logs, loading, hideProduct = false }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div className="animate-spin" style={{ width: '24px', height: '24px', border: '3px solid var(--slate-200)', borderTop: '4px solid var(--primary)', borderRadius: '50%', margin: '0 auto' }}></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--slate-400)' }}>
        No restock activity found
      </div>
    );
  }

  return (
    <div className="premium-table-container" style={{ border: 'none', background: 'transparent' }}>
      <table className="premium-table">
        <thead>
          <tr>
            <th style={{ paddingLeft: '16px' }}>Date & Time</th>
            <th>Staff Name</th>
            {!hideProduct && <th>Product</th>}
            <th style={{ textAlign: 'center' }}>Previous Stock</th>
            <th style={{ textAlign: 'center' }}>Added Stock</th>
            <th style={{ textAlign: 'right', paddingRight: '16px' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td style={{ paddingLeft: '16px' }}>
                <div style={{ fontWeight: '600', color: 'var(--slate-900)' }}>
                  {new Date(log.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--slate-400)', fontWeight: '500' }}>
                  {new Date(log.created_at).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  })}
                </div>
              </td>
              <td style={{ fontWeight: '700', color: 'var(--slate-900)' }}>{log.user_name}</td>
              {!hideProduct && (
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--slate-700)' }}>{log.product_name}</div>
                </td>
              )}
              <td style={{ textAlign: 'center' }}>
                <span style={{ 
                  fontSize: '13px', 
                  color: 'var(--slate-500)', 
                  fontWeight: '700',
                  background: 'var(--card-bg)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-main)'
                }}>
                  {log.old_stock && log.old_stock !== '0' ? log.old_stock : '--'}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                  <span style={{ 
                    fontWeight: '800', 
                    color: 'var(--success)', 
                    background: 'rgba(16, 185, 129, 0.05)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.1)',
                    fontSize: '14px'
                  }}>
                    +{log.quantity_added}
                  </span>
              </td>
              <td style={{ textAlign: 'right', paddingRight: '16px' }}>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  background: log.user_role === 'owner' ? 'var(--info-light)' : 'var(--warning-light)',
                  color: log.user_role === 'owner' ? 'var(--info)' : 'var(--warning)',
                  textTransform: 'uppercase',
                  border: `1px solid ${log.user_role === 'owner' ? 'var(--info)' : 'var(--warning)'}22`
                }}>
                  {log.user_role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestockTable;
