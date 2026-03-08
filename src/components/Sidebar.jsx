import React from 'react';

const Sidebar = ({ user, activePage, onNavigate, onLogout, isCollapsed, isMobileOpen }) => {
  const isOwner = user?.role === 'owner';

  const menuItems = isOwner ? [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'pos', label: 'POS Terminal', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'inventory', label: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v4m0 0l8 4m-8-4l-8 4m8 5v5' },
    { id: 'sales', label: 'Sales Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'audit', label: 'Audit Logs', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
  ] : [
    { id: 'pos', label: 'POS Terminal', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'inventory', label: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v4m0 0l8 4m-8-4l-8 4m8 5v5' }
  ];

  const sidebarClass = `sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`;

  return (
    <div className={sidebarClass}>
      {/* Brand Header */}
      <div className="sidebar-brand-wrapper" style={{ 
        padding: isCollapsed ? '20px 0' : '20px 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        minHeight: '90px',
        cursor: 'pointer',
        background: 'rgba(0,0,0,0.05)'
      }}>
        <div className="brand-logo-container" style={{ marginRight: isCollapsed ? '0' : '12px' }}>
          <img src="public/uploads/logo3.png" alt="RetailPOS Logo" className="brand-logo" />
        </div>
        {!isCollapsed && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'white', letterSpacing: '-0.02em' }}>RetailPOS</h2>
            <p style={{ fontSize: '11px', color: 'var(--slate-500)', fontWeight: '600', textTransform: 'uppercase' }}>Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, paddingTop: '24px' }}>
        {menuItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-link ${activePage === item.id ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
            style={{ 
               marginBottom: '8px', 
               justifyContent: isCollapsed ? 'center' : 'flex-start',
               padding: isCollapsed ? '12px 0' : '12px 16px',
               margin: isCollapsed ? '2px 12px' : '2px 16px'
            }}
            title={isCollapsed ? item.label : ''}
          >
            <svg 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              style={{ marginRight: isCollapsed ? '0' : '12px', width: '20px', height: '20px' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            {!isCollapsed && <span style={{ fontWeight: '500' }}>{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* User Footer */}
      <div style={{ padding: isCollapsed ? '20px 0' : '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: isCollapsed ? '0 12px' : '0 16px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: '700', 
              fontSize: '14px',
              color: 'white',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden'
            }}>
              {(() => {
                let avatarUrl = user?.avatar_url;
                if (avatarUrl && !avatarUrl.startsWith('/') && !avatarUrl.startsWith('http')) {
                  avatarUrl = `/uploads/${avatarUrl}`;
                }
                return avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.full_name?.charAt(0).toUpperCase()
                );
              })()}
            </div>
            {!isCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.full_name}
                </p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', textTransform: 'uppercase' }}>
                  {user?.role}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button 
                 onClick={onLogout}
                 title="Logout"
                 style={{ 
                   background: 'rgba(255,255,255,0.05)', 
                   border: 'none', 
                   color: 'var(--slate-400)', 
                   cursor: 'pointer',
                   padding: '8px',
                   borderRadius: '8px',
                   display: 'flex',
                   transition: 'all 0.2s'
                 }}
                 onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                 onMouseOut={(e) => e.currentTarget.style.color = 'var(--slate-400)'}
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
          {isCollapsed && (
             <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
               <button 
                  onClick={onLogout}
                  style={{ 
                    marginTop: '12px',
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--slate-500)', 
                    cursor: 'pointer'
                  }}
               >
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
               </button>
             </div>
          )}
      </div>
    </div>
  );
};

export default Sidebar;
