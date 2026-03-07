import React from 'react';

const LowStockAlerts = ({ lowStock }) => {
  return (
    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
         <div>
           <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Low Stock Alerts</h3>
         </div>
         <span className="badge badge-danger" style={{ 
           width: '20px', 
           height: '20px', 
           padding: 0, 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'center'
         }}>
           {lowStock?.length || 0}
         </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {lowStock?.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < lowStock.length - 1 ? '1px solid var(--slate-100)' : 'none' }}>
             <div>
               <p style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</p>
               <p style={{ fontSize: '12px', color: 'var(--slate-400)' }}>{item.category}</p>
             </div>
             <div style={{ textAlign: 'right' }}>
               <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--danger)' }}>{item.stock}</p>
               <p style={{ fontSize: '10px', color: 'var(--slate-400)' }}>units left</p>
             </div>
          </div>
        ))}
        {(!lowStock || lowStock.length === 0) && (
           <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>No alerts</div>
        )}
      </div>
    </div>
  );
};

export default LowStockAlerts;
