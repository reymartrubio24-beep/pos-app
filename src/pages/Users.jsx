import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import UserTable from '../components/Users/UserTable';
import UserModal from '../components/Users/UserModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('edit'); // 'edit' or 'create'
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    full_name: '',
    role: 'cashier',
    password: ''
  });
  const [modalLoading, setModalLoading] = useState(false);

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

  const handleCreateClick = () => {
    setModalMode('create');
    setEditingUser(null);
    setUserForm({
      username: '',
      full_name: '',
      role: 'cashier',
      password: ''
    });
    setShowModal(true);
  };

  const handleEditClick = (user) => {
    setModalMode('edit');
    setEditingUser(user);
    setUserForm({
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      password: '' // leave ra nimo blank para dili mausab kung dili nimo i-fill up
    });
    setShowModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (modalMode === 'edit') {
        const data = await api.post('/api/users/update.php', {
          id: editingUser.id,
          ...userForm
        });
        if (data.success) {
          setShowModal(false);
          fetchUsers();
        } else {
          alert(data.error || 'Update failed');
        }
      } else {
        const data = await api.post('/api/users/create.php', userForm);
        if (data.success) {
          setShowModal(false);
          fetchUsers();
        } else {
          alert(data.error || 'Creation failed');
        }
      }
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setModalLoading(false);
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
    <div style={{ animation: 'fadeIn 0.5s ease', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                 width: '240px',
                 outline: 'none'
               }}
             />
          </div>
          <button 
            className="premium-btn" 
            onClick={handleCreateClick}
            style={{ padding: '10px 20px' }}
          >
            <svg style={{ width: '18px', height: '18px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
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

      <UserModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveUser}
        form={userForm}
        setForm={setUserForm}
        loading={modalLoading}
        mode={modalMode}
      />
    </div>
  );
};

export default Users;
