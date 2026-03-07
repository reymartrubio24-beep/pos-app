import React from 'react';

const RevenueChart = ({ stats }) => {
  const chartData = (stats?.chart || Array(7).fill({revenue: 0, date: new Date()})).slice(-7);
  const maxRevenue = Math.max(...(chartData.map(d => d.revenue) || [1000])) || 1000;

  return (
    <div className="premium-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Weekly Revenue</h3>
          <p style={{ fontSize: '13px', color: 'var(--slate-500)' }}>Sales performance this week</p>
        </div>
        <span className="badge badge-info" style={{ fontWeight: '600' }}>This Week</span>
      </div>
      
      <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px 10px', gap: '12px' }}>
        {chartData.map((day, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end' }}>
               <div style={{ 
                  background: 'var(--primary)', 
                  width: '100%', 
                  borderRadius: '4px 4px 2px 2px', 
                  height: `${Math.max(4, (day.revenue / maxRevenue) * 180)}px`,
                  transition: 'height 0.3s ease'
                }} title={`₱${day.revenue}`}></div>
            </div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--slate-500)', marginTop: '12px' }}>
              {new Date(day.date).toLocaleDateString('en-US', {weekday: 'short'})}
            </p>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '24px', borderTop: '1px solid var(--slate-100)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
         <p style={{ fontSize: '13px', color: 'var(--slate-500)', fontWeight: '500' }}>Total: <span style={{ color: 'var(--slate-900)', fontWeight: '700' }}>₱{parseFloat(stats?.week?.revenue || 0).toLocaleString()}</span></p>
         <p style={{ fontSize: '13px', color: 'var(--slate-500)', fontWeight: '500' }}><span style={{ color: 'var(--slate-900)', fontWeight: '700' }}>{stats?.week?.count || 0}</span> transactions</p>
      </div>
    </div>
  );
};

export default RevenueChart;
