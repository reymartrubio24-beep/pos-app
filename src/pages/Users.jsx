import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import UserTable from '../components/Users/UserTable';
import UserEditModal from '../components/Users/UserEditModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    full_name: '',
    role: '',
    password: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/users/index.php');
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      password: '' // Leave blank unless changing
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const data = await api.post('/api/users/update.php', {
        id: editingUser.id,
        ...editForm
      });
      if (data.success) {
        setShowEditModal(false);
        fetchUsers();
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      alert(err.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.full_name}?`)) return;
    
    try {
      const data = await api.post('/api/users/delete.php', { id: user.id });
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>System Users</h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '14px' }}>Manage and monitor all cashier and owner accounts</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
             <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-sub)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
             <input 
               type="text" 
               placeholder="Search users..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               style={{ 
                 background: 'var(--card-bg)', 
                 border: '1px solid var(--border-main)', 
                 borderRadius: '10px', 
                 padding: '10px 16px 10px 36px', 
                 color: 'var(--text-main)',
                 fontSize: '13px',
                 width: '260px',
                 outline: 'none'
               }}
             />
          </div>
        </div>
      </div>

      <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
        <UserTable 
          users={filteredUsers} 
          loading={loading} 
          onEdit={handleEditClick} 
          onDelete={handleDelete} 
        />
      </div>

      <UserEditModal 
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdate}
        editForm={editForm}
        setEditForm={setEditForm}
        updateLoading={updateLoading}
      />
    </div>
  );
};

export default Users;
