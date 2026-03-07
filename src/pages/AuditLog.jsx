import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import AuditTable from '../components/Audit/AuditTable';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/audit/index.php');
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch logs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm('Are you absolutely sure you want to clear ALL audit logs? This action cannot be undone.')) return;
    
    try {
      const data = await api.post('/api/audit/clear.php');
      if (data.success) {
        alert('Audit logs cleared successfully');
        fetchLogs();
      } else {
        alert('Error: ' + (data.error || 'Clear failed'));
      }
    } catch (err) {
      alert(err.message || 'Failed to clear logs');
    }
  };

  const handleExport = () => {
    window.location.href = '/api/audit/export.php';
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="audit-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Audit Logs</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '14px', fontWeight: '500' }}>Monitor all system activities and administrative changes</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="premium-btn" 
            onClick={handleExport}
            style={{ padding: '0 20px', height: '42px', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: 'var(--slate-700)', border: '1px solid var(--border-main)', fontSize: '13px', fontWeight: '600' }}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button 
            className="premium-btn" 
            onClick={handleClearLogs}
            style={{ padding: '0 20px', height: '42px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--danger-light)', color: 'var(--danger)', border: 'none', fontSize: '13px', fontWeight: '600' }}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Data
          </button>
        </div>
      </div>

      <div className="premium-card" style={{ padding: 0, overflow: 'hidden', boxShadow: 'var(--card-shadow-md)' }}>
        <AuditTable logs={logs} loading={loading} getInitials={getInitials} />
      </div>
    </div>
  );
};

export default AuditLog;
