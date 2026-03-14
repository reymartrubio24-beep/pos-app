import React from 'react';

const UserModal = ({ 
  show, 
  onClose, 
  onSave, 
  form, 
  setForm, 
  loading,
  mode = 'edit' // 'edit' or 'create'
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
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '24px' }}>
          {mode === 'edit' ? 'Edit User Account' : 'Register New Account'}
        </h2>
        <form onSubmit={onSave}>
          <div style={{ marginBottom: '16px' }}>
            <label className="input-label" style={{ color: 'var(--text-sub)' }}>Full Name</label>
            <input 
              type="text" className="input-field" 
              value={form.full_name}
              onChange={(e) => setForm({...form, full_name: e.target.value})}
              placeholder="e.g. Juan Dela Cruz"
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="input-label" style={{ color: 'var(--text-sub)' }}>Username</label>
            <input 
              type="text" className="input-field" 
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value})}
              placeholder="e.g. juan24"
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="input-label" style={{ color: 'var(--text-sub)' }}>Role</label>
            <select 
              className="input-field" 
              value={form.role}
              onChange={(e) => setForm({...form, role: e.target.value})}
              required
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label className="input-label" style={{ color: 'var(--text-sub)' }}>
              {mode === 'edit' ? 'New Password (leave blank if unchanged)' : 'Password'}
            </label>
            <input 
              type="password" className="input-field" 
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              required={mode === 'create'}
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
              disabled={loading}
              style={{ 
                flex: 1, padding: '12px', borderRadius: '10px', 
                border: 'none', background: 'var(--success)',
                color: 'white', fontWeight: '600', cursor: 'pointer'
              }}
            >
              {loading ? 'Processing...' : mode === 'edit' ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
