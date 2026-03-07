import React from 'react';

const UserEditModal = ({ 
  show, 
  onClose, 
  onUpdate, 
  editForm, 
  setEditForm, 
  updateLoading 
}) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, animation: 'fadeIn 0.2s ease'
    }}>
      <div className="premium-card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '24px' }}>Edit User Account</h2>
        <form onSubmit={onUpdate}>
          <div style={{ marginBottom: '16px' }}>
            <label className="input-label" style={{ color: 'var(--text-sub)' }}>Full Name</label>
            <input 
              type="text" className="input-field" 
              value={editForm.full_name}
              onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="input-label" style={{ color: 'var(--text-sub)' }}>Username</label>
            <input 
              type="text" className="input-field" 
              value={editForm.username}
              onChange={(e) => setEditForm({...editForm, username: e.target.value})}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="input-label" style={{ color: 'var(--text-sub)' }}>Role</label>
            <select 
              className="input-field" 
              value={editForm.role}
              onChange={(e) => setEditForm({...editForm, role: e.target.value})}
            >
              <option value="cashier">Cashier</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label className="input-label" style={{ color: 'var(--text-sub)' }}>New Password (leave blank if unchanged)</label>
            <input 
              type="password" className="input-field" 
              placeholder="••••••••"
              value={editForm.password}
              onChange={(e) => setEditForm({...editForm, password: e.target.value})}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ 
                flex: 1, padding: '12px', borderRadius: '10px', 
                border: '1px solid var(--border-main)', background: 'transparent',
                color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={updateLoading}
              style={{ 
                flex: 1, padding: '12px', borderRadius: '10px', 
                border: 'none', background: 'var(--success)',
                color: 'white', fontWeight: '600', cursor: 'pointer'
              }}
            >
              {updateLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
