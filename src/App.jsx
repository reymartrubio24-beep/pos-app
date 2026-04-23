import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POSTerminal from './pages/POSTerminal';
import Inventory from './pages/Inventory';
import SalesReport from './pages/SalesReport';
import AuditLog from './pages/AuditLog';
import Users from './pages/Users';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import { api } from './utils/api';
import './index.css';


const App = () => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState(localStorage.getItem('activePage') || 'dashboard');
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const savedUser = localStorage.getItem('pos_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    document.documentElement.setAttribute('data-theme', theme);

    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('activePage', activePage);
    }
  }, [activePage, user]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('pos_user', JSON.stringify(userData));
    // inig login nimo sa cashier didto ka diretso sa pos terminal
    setActivePage(userData.role === 'owner' || userData.role === 'admin' ? 'dashboard' : 'pos');
  };


  const handleLogout = async () => {
    try {
      await api.get('/api/auth/logout.php');
      setUser(null);
      localStorage.removeItem('pos_user');
      localStorage.removeItem('activePage');
    } catch(err) {
      console.error(err);
      setUser(null);
      localStorage.removeItem('pos_user');
      localStorage.removeItem('activePage');
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--slate-200)', borderTop: '4px solid var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }}></div>
        <p style={{ color: 'var(--slate-500)', fontWeight: '600' }}>Initializing Terminal...</p>
      </div>
    </div>
  );

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'pos': return <POSTerminal user={user} />;
      case 'inventory': return <Inventory user={user} />;
      case 'sales': return (user.role === 'owner' || user.role === 'admin') ? <SalesReport /> : <Dashboard user={user} />;
      case 'audit': return (user.role === 'owner' || user.role === 'admin') ? <AuditLog /> : <Dashboard user={user} />;
      case 'users': return (user.role === 'owner' || user.role === 'admin') ? <Users user={user} /> : <Dashboard user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  const layoutClass = `layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${activePage === 'pos' ? 'pos-terminal-active' : ''}`;

  return (
    <div className={layoutClass}>
      {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />}
      <Sidebar 
        user={user} 
        activePage={activePage} 
        onNavigate={(page) => { setActivePage(page); setIsMobileOpen(false); }} 
        onLogout={handleLogout} 
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileOpen}
      />
      <div className="main-content-layout">
         <TopBar 
            activePage={activePage} 
            user={user} 
            onToggleSidebar={toggleSidebar}
            theme={theme}
            onToggleTheme={toggleTheme}
            onLogout={handleLogout}
         />
         <main className="page-container">
            {renderPage()}
         </main>
         {activePage !== 'pos' && <Footer />}
      </div>
    </div>
  );
};

export default App;
