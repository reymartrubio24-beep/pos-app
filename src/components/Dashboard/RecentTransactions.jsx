import React from 'react';

const RecentTransactions = ({ recent }) => {
  return (
    <div className="premium-card">
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Recent Transactions</h3>
          <p style={{ fontSize: '12px', color: 'var(--slate-500)' }}>{recent?.length || 0} total</p>
       </div>
       <div className="premium-table-container" style={{ border: 'none' }}>
          <table className="premium-table">
             <thead>
                <tr>
                   <th>Transaction ID</th>
                   <th>Cashier</th>
                   <th>Date & Time</th>
                   <th>Products</th>
                   <th>Items</th>
                   <th>Total</th>
                   <th>Paid</th>
                   <th style={{ textAlign: 'right' }}>Change</th>
                </tr>
             </thead>
             <tbody>
                {recent?.map((tx, i) => (
                   <tr key={i}>
                      <td style={{ color: 'var(--primary)', fontWeight: '600' }}>TXN-{tx.id.toString().padStart(5, '0')}</td>
                      <td>{tx.cashier_name}</td>
                      <td style={{ color: 'var(--slate-500)' }}>{new Date(tx.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                      <td style={{ fontSize: '12px', color: 'var(--slate-600)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={tx.product_names}>
                         {tx.product_names || 'N/A'}
                      </td>
                      <td>{tx.item_count || 1} items</td>
                      <td style={{ fontWeight: '700' }}>₱{parseFloat(tx.total).toLocaleString()}</td>
                      <td style={{ color: 'var(--success)', fontWeight: '600' }}>₱{parseFloat(tx.amount_received || tx.total).toLocaleString()}</td>
                      <td style={{ textAlign: 'right', color: 'var(--slate-500)' }}>₱{Math.max(0, parseFloat(tx.amount_received || tx.total) - parseFloat(tx.total)).toLocaleString()}</td>
                   </tr>
                ))}
                {(!recent || recent.length === 0) && (
                   <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>No recent transactions</td>
                   </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default RecentTransactions;
