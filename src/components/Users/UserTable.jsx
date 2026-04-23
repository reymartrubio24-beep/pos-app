import React from 'react';

const UserTable = ({ users, loading, onEdit, onDelete, currentUser }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-sub)' }}>Loading users...</div>
    );
  }

  if (users.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-sub)' }}>No users found</div>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-main)' }}>
          <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '12px', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
          <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '12px', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</th>
          <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '12px', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
          <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '12px', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined Date</th>
          <th style={{ textAlign: 'center', padding: '16px 24px', fontSize: '12px', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
          <th style={{ textAlign: 'right', padding: '16px 24px', fontSize: '12px', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} style={{ borderBottom: '1px solid var(--border-main)', transition: 'background 0.2s' }} className="table-row-hover">
            <td style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '10px', 
                  background: user.role === 'owner' ? 'rgba(16, 185, 129, 0.1)' : 
                             user.role === 'admin' ? 'rgba(59, 130, 246, 0.1)' : 
                             'rgba(148, 163, 184, 0.1)',
                  color: user.role === 'owner' ? 'var(--success)' : 
                         user.role === 'admin' ? '#3b82f6' : 
                         'var(--text-sub)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '14px'
                }}>
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{user.full_name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>ID: #{user.id}</div>
                </div>
              </div>
            </td>
            <td style={{ padding: '16px 24px', color: 'var(--text-main)', fontSize: '14px' }}>{user.username}</td>
            <td style={{ padding: '16px 24px' }}>
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '11px', 
                fontWeight: '700',
                textTransform: 'uppercase',
                background: user.role === 'owner' ? 'rgba(16, 185, 129, 0.1)' : 
                           user.role === 'admin' ? 'rgba(59, 130, 246, 0.1)' : 
                           'rgba(148, 163, 184, 0.1)',
                color: user.role === 'owner' ? 'var(--success)' : 
                       user.role === 'admin' ? '#3b82f6' : 
                       'var(--text-sub)',
                border: `1px solid ${user.role === 'owner' ? 'rgba(16, 185, 129, 0.2)' : 
                                     user.role === 'admin' ? 'rgba(59, 130, 246, 0.2)' : 
                                     'rgba(148, 163, 184, 0.2)'}`
              }}>
                {user.role}
              </span>
            </td>
            <td style={{ padding: '16px 24px', color: 'var(--text-sub)', fontSize: '13px' }}>
              {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </td>
            <td style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '500' }}>Active</span>
              </div>
            </td>
            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
               <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                 {!(currentUser?.role === 'owner' && user.username === 'admin') && (
                   <button 
                    onClick={() => onEdit(user)}
                    style={{ 
                      background: 'rgba(16, 185, 129, 0.05)', 
                      border: 'none', 
                      color: 'var(--success)', 
                      padding: '8px', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      opacity: 0.7,
                      transition: 'all 0.2s'
                    }}
                    title="Edit User"
                  >
                    <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                 )}
                  {user.username !== 'admin' && (
                    <button 
                      onClick={() => onDelete(user)}
                      className="delete-btn-subtle"
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.05)', 
                        border: 'none', 
                        color: 'var(--danger)', 
                        padding: '8px', 
                        borderRadius: '8px',
                        cursor: 'pointer',
                        opacity: 0.7,
                        transition: 'all 0.2s'
                      }}
                      title="Delete User"
                    >
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
               </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
