import React, { useState } from 'react';

const TopBar = ({ activePage, user, onToggleSidebar, theme, onToggleTheme, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const pageTitles = {
    dashboard: 'Dashboard',
    pos: 'POS Terminal',
    inventory: 'Inventory',
    sales: 'Sales Reports',
    audit: 'Audit Logs',
    users: 'System Users'
  };



  return (
    <header className="top-bar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="sidebar-toggle-btn" onClick={onToggleSidebar} title="Toggle Sidebar">
           <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
           </svg>
        </button>
        <nav style={{ fontSize: '13px', color: 'var(--text-sub)', fontWeight: '500' }}>
          <span style={{ color: 'var(--text-sub)' }}>Pages</span>
          <span style={{ margin: '0 8px', color: 'var(--slate-400)' }}>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{pageTitles[activePage]}</span>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={onToggleTheme}
            style={{ 
              background: 'var(--slate-100)', 
              border: 'none', 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-sub)',
              transition: 'var(--transition-main)'
            }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </button>

         <div 
           style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', position: 'relative' }}
           onClick={() => setShowDropdown(!showDropdown)}
           onMouseLeave={() => setShowDropdown(false)}
         >
           <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="user-desktop-info">
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.2' }}>{user?.full_name}</span>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase' }}>{user?.role}</span>
           </div>
           
           <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '15px',
              overflow: 'hidden',
              position: 'relative',
              transition: 'transform 0.2s',
           }}
           >
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

           {showDropdown && (
             <div style={{ 
               position: 'absolute', 
               top: '100%', 
               right: 0, 
               paddingTop: '8px', 
               zIndex: 100,
               animation: 'fadeIn 0.2s ease'
             }}>
               <div style={{ 
                 background: 'var(--card-bg)', 
                 border: '1px solid var(--border-main)', 
                 borderRadius: '12px', 
                 boxShadow: 'var(--card-shadow)',
                 minWidth: '180px',
                 overflow: 'hidden'
               }}>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onLogout(); }}
                   style={{ 
                     width: '100%', 
                     padding: '12px 16px', 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '10px',
                     border: 'none',
                     background: 'none',
                     color: 'var(--danger)',
                     fontSize: '13px',
                     fontWeight: '600',
                     cursor: 'pointer',
                     textAlign: 'left',
                     transition: 'background 0.2s'
                   }}
                   onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.05)'}
                   onMouseOut={(e) => e.target.style.background = 'none'}
                 >
                   <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                   </svg>
                   Sign Out
                 </button>
               </div>
             </div>
           )}
         </div>
      </div>
    </header>
  );
};

export default TopBar;
