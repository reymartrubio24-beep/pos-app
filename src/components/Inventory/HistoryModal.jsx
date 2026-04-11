import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import RestockTable from './RestockTable';

const HistoryModal = ({ show, onClose, product = null, user = null }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    if (show) {
      if (product) {
        fetchProductHistory();
      } else {
        fetchGlobalHistory();
      }
    }
  }, [show, product]);

  const fetchProductHistory = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/api/products/history.php?name=${encodeURIComponent(product.name)}`);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch history error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalHistory = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/products/restock_logs.php');
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch global logs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    let url = '/api/products/export_history.php';
    if (product) {
      url += `?name=${encodeURIComponent(product.name)}`;
    }
    window.location.href = url;
  };

  if (!show) return null;

  const filteredLogs = logs.filter(log => {
    // Only restocks
    const isRestock = log.details.toLowerCase().includes('restock');
    if (!isRestock) return false;

    if (filter === 'all') return true;
    const logDate = new Date(log.created_at);
    const now = new Date();
    
    if (filter === 'today') {
      return logDate.toDateString() === now.toDateString();
    }
    
    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return logDate >= weekAgo;
    }
    
    if (filter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return logDate >= monthAgo;
    }
    
    return true;
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', width: '95vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0, borderRadius: '20px' }}>
        <div className="modal-header" style={{ padding: '24px 32px', borderBottom: '1px solid var(--slate-100)' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--slate-900)', letterSpacing: '-0.5px' }}>
              {product ? 'Product History' : 'Global Stock History'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--slate-400)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
              {product ? `${product.name} • #${product.id.toString().padStart(4, '0')}` : 'All restocking activities across your shop'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {(user?.role === 'owner' || user?.role === 'admin') && (
              <button 
                onClick={handleExportCSV} 
                className="premium-btn" 
                style={{ 
                  background: 'var(--card-bg)', 
                  color: 'var(--slate-700)', 
                  border: '1px solid var(--border-main)', 
                  padding: '0 16px', 
                  height: '40px', 
                  fontSize: '13px', 
                  fontWeight: '700', 
                  boxShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '10px'
                }}
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            )}
            <button onClick={onClose} style={{ background: 'var(--slate-50)', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', padding: '8px', borderRadius: '10px', transition: 'all 0.2s' }}>
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 32px', background: 'var(--slate-50)', display: 'flex', gap: '8px', borderBottom: '1px solid var(--slate-100)' }}>
          {['all', 'today', 'week', 'month'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                background: filter === f ? 'var(--primary-light)' : 'var(--card-bg)',
                color: filter === f ? 'var(--primary)' : 'var(--slate-600)',
                textTransform: 'capitalize',
                boxShadow: filter === f ? '0 2px 4px rgba(var(--primary-rgb), 0.1)' : 'var(--card-shadow)',
                transition: 'all 0.2s'
              }}
            >
              {f === 'all' ? 'All Time' : f}
            </button>
          ))}
        </div>

        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <RestockTable logs={filteredLogs} loading={loading} hideProduct={!!product} />
        </div>
        
        <div className="modal-footer" style={{ padding: '16px 32px', background: 'var(--slate-50)', borderTop: '1px solid var(--slate-100)' }}>
           <p style={{ fontSize: '11px', color: 'var(--slate-400)', fontWeight: '600', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
             This is an immutable secure audit log. Entries cannot be modified or deleted.
           </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
