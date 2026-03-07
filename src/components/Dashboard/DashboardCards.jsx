import React from 'react';

const DashboardCards = ({ stats }) => {
  const cards = [
    { 
      title: "Today's Revenue", 
      value: `₱${parseFloat(stats?.today?.revenue || 0).toLocaleString()}`, 
      count: `${stats?.today?.count || 0} transactions`, 
      icon: (
        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'var(--primary)',
      trend: '+8.2% from yesterday',
      trendUp: true
    },
    { 
      title: "This Week", 
      value: `₱${parseFloat(stats?.week?.revenue || 0).toLocaleString()}`, 
      count: `${stats?.week?.count || 0} transactions`, 
      icon: (
        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'var(--success)',
      trend: '+12.5% from last week',
      trendUp: true
    },
    { 
      title: "This Month", 
      value: `₱${parseFloat(stats?.month?.revenue || 0).toLocaleString()}`, 
      count: `${stats?.month?.count || 0} transactions`, 
      icon: (
        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 118 0m-4 8v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h11a2 2 0 012 2v1m-7 0H9" />
        </svg>
      ),
      color: '#8b5cf6',
      trend: '+5.1% from last month',
      trendUp: true
    },
    { 
      title: "Avg. Order", 
      value: `₱${(parseFloat(stats?.today?.revenue || 0) / (parseInt(stats?.today?.count) || 1)).toFixed(2)}`, 
      count: "Today's average", 
      icon: (
        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'var(--warning)',
      trend: '-2.3% from yesterday',
      trendUp: false
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
      {cards.map((card, i) => (
        <div key={i} className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p style={{ color: 'var(--slate-500)', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>{card.title}</p>
              <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{card.value}</h2>
            </div>
            <div style={{ 
              background: card.color, 
              color: 'white', 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: `0 4px 10px ${card.color}40`
            }}>
              {card.icon}
            </div>
          </div>
          
          <p style={{ fontSize: '12px', color: 'var(--slate-400)', marginBottom: '12px', fontWeight: '500' }}>{card.count}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
             <span style={{ 
                color: card.trendUp ? 'var(--success)' : 'var(--danger)',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
               <svg style={{ width: '14px', height: '14px', transform: card.trendUp ? 'rotate(0deg)' : 'rotate(180deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
               </svg>
               {card.trend}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
