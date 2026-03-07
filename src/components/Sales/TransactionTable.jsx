import React from 'react';

const TransactionTable = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div className="animate-spin" style={{ width: '32px', height: '32px', border: '4px solid var(--slate-200)', borderTop: '4px solid var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }}></div>
        <p style={{ color: 'var(--slate-400)', fontSize: '14px', fontWeight: '500' }}>Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--slate-400)' }}>
        <svg style={{ width: '48px', height: '48px', color: 'var(--slate-100)', margin: '0 auto 16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--slate-500)', marginBottom: '4px' }}>No transactions found</p>
        <p style={{ fontSize: '13px' }}>Try adjusting your date range filter</p>
      </div>
    );
  }

  return (
    <div className="premium-table-container" style={{ border: 'none' }}>
      <table className="premium-table">
        <thead>
          <tr>
            <th style={{ paddingLeft: '24px' }}>Invoice No.</th>
            <th>Date & Time</th>
            <th>Staff Name</th>
            <th>Subtotal</th>
            <th>Tax (12%)</th>
            <th style={{ textAlign: 'right', paddingRight: '24px' }}>Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td style={{ paddingLeft: '24px' }}>
                <div style={{ fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.5px' }}>#TRX-{t.id.toString().padStart(4, '0')}</div>
              </td>
              <td style={{ color: 'var(--slate-500)', fontSize: '13px', fontWeight: '500' }}>
                <div>{new Date(t.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>{new Date(t.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
              </td>
              <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{t.cashier_name}</td>
              <td style={{ color: 'var(--text-sub)' }}>₱{parseFloat(t.subtotal).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              <td style={{ color: 'var(--text-sub)' }}>₱{parseFloat(t.vat).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-main)' }}>₱{parseFloat(t.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
