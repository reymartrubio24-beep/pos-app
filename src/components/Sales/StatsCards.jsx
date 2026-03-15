import React from 'react';

const StatsCards = ({ totalSales, totalOrders }) => {
  const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
      <div className="premium-card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
           <div>
              <p style={{ color: 'var(--slate-500)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Total Revenue</p>
              <h2 style={{ fontSize: '30px', fontWeight: '800', color: 'var(--slate-900)' }}>₱{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
           </div>
           <div style={{ color: 'var(--primary)', background: 'var(--primary-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
           </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
           <span className="badge badge-success" style={{ fontSize: '10px' }}>+12.5%</span>
           <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>vs previous period</span>
        </div>
      </div>

      <div className="premium-card" style={{ borderLeft: '4px solid var(--success)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
           <div>
              <p style={{ color: 'var(--slate-500)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Total Sales</p>
              <h2 style={{ fontSize: '30px', fontWeight: '800', color: 'var(--slate-900)' }}>{totalOrders}</h2>
           </div>
           <div style={{ color: 'var(--success)', background: 'var(--success-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 118 0m-4 8v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h11a2 2 0 012 2v1m-7 0H9" />
              </svg>
           </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
           <span className="badge badge-success" style={{ fontSize: '10px' }}>Active</span>
           <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>{totalOrders > 0 ? 'Regular activity' : 'No activity'}</span>
        </div>
      </div>

      <div className="premium-card" style={{ borderLeft: '4px solid var(--warning)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
           <div>
              <p style={{ color: 'var(--slate-500)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Average Sales</p>
              <h2 style={{ fontSize: '30px', fontWeight: '800', color: 'var(--slate-900)' }}>₱{avgTicket.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
           </div>
           <div style={{ color: 'var(--warning)', background: 'var(--warning-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14" />
              </svg>
           </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
           <span className="badge badge-warning" style={{ fontSize: '10px' }}>Stable</span>
           <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>Typical Sales </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
