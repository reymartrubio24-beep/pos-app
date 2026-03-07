import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import DashboardCards from '../components/Dashboard/DashboardCards';
import RevenueChart from '../components/Dashboard/RevenueChart';
import LowStockAlerts from '../components/Dashboard/LowStockAlerts';
import RecentTransactions from '../components/Dashboard/RecentTransactions';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/api/dashboard/stats.php');
        if (data) setStats(data);
      } catch (err) {
        console.error('Fetch stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
       <div className="animate-spin" style={{ width: '30px', height: '30px', border: '3px solid var(--slate-200)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div className="dashboard-content">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '14px' }}>Overview of your store's performance</p>
      </div>

      <DashboardCards stats={stats} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <RevenueChart stats={stats} />
        <LowStockAlerts lowStock={stats?.lowStock} />
      </div>

      <RecentTransactions recent={stats?.recent} />
    </div>
  );
};

export default Dashboard;
