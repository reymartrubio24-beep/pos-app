import React from 'react';

const AuditTable = ({ logs, loading, getInitials }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div className="animate-spin" style={{ width: '32px', height: '32px', border: '4px solid var(--slate-200)', borderTop: '4px solid var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }}></div>
        <p style={{ color: 'var(--slate-400)', fontSize: '14px', fontWeight: '500' }}>Retrieving system logs...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--slate-400)' }}>
        <svg style={{ width: '48px', height: '48px', color: 'var(--slate-100)', margin: '0 auto 16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--slate-500)', marginBottom: '4px' }}>No logs recorded</p>
        <p style={{ fontSize: '13px' }}>System activities will appear here as they happen</p>
      </div>
    );
  }

  return (
    <div className="premium-table-container" style={{ border: 'none' }}>
      <table className="premium-table">
        <thead>
          <tr>
            <th style={{ paddingLeft: '24px', width: '200px' }}>Timestamp</th>
            <th style={{ width: '250px' }}>User</th>
            <th style={{ width: '120px' }}>Role</th>
            <th style={{ width: '180px' }}>Action</th>
            <th style={{ paddingRight: '24px' }}>Log Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td style={{ paddingLeft: '24px' }}>
                <div style={{ color: 'var(--text-main)', fontSize: '13px', fontWeight: '600' }}>{new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                <div style={{ color: 'var(--slate-600)', fontSize: '11px', fontWeight: '700' }}>{new Date(log.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ 
                     width: '32px', 
                     height: '32px', 
                     borderRadius: '50%', 
                     background: 'var(--slate-100)', 
                     color: 'var(--slate-600)', 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     fontSize: '11px', 
                     fontWeight: '800' 
                   }}>
                     {getInitials(log.user_name)}
                   </div>
                   <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '13px' }}>{log.user_name}</div>
                </div>
              </td>
              <td>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  textTransform: 'uppercase',
                  background: log.user_role === 'owner' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: log.user_role === 'owner' ? '#8b5cf6' : '#10b981'
                }}>
                  {log.user_role}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: 
                      log.action === 'Login' ? '#10b981' : 
                      log.action === 'Logout' ? '#3b82f6' :
                      log.action === 'Transaction' ? '#F59E0B' : 
                      log.action === 'Update' ? '#F59E0B' :
                      log.action === 'Delete' ? '#EF4444' : '#64748b'
                  }} />
                  <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--text-main)' }}>{log.action}</span>
                </div>
              </td>
              <td style={{ color: 'var(--slate-800)', fontSize: '13px', paddingRight: '24px', fontWeight: '600' }}>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable;
