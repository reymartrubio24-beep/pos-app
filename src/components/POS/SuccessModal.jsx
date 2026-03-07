import React from 'react';

const SuccessModal = ({ show, transactionResult, onClose }) => {
  if (!show || !transactionResult) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div className="success-icon-container">
            <svg style={{ width: '40px', height: '40px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '8px' }}>Payment Successful!</h2>
          <p style={{ fontSize: '14px', color: 'var(--slate-400)', marginBottom: '32px' }}>Transaction ID: #{transactionResult.id}</p>

          <div className="receipt-box">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--slate-900)', textTransform: 'uppercase', letterSpacing: '1px' }}>RETAILPOS STORE</div>
              <div style={{ fontSize: '11px', color: 'var(--slate-400)' }}>Official Receipt</div>
            </div>

            {transactionResult.items.map((item, i) => (
              <div key={i} className="receipt-item">
                <span style={{ color: 'var(--slate-600)' }}>{item.name} x{item.quantity}</span>
                <span style={{ fontWeight: '600' }}>₱{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            ))}

            <div className="receipt-divider"></div>

            <div className="receipt-item">
              <span style={{ color: 'var(--slate-400)' }}>Total</span>
              <span style={{ fontWeight: '800', fontSize: '16px' }}>₱{transactionResult.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="receipt-item">
              <span style={{ color: 'var(--slate-400)' }}>Paid</span>
              <span style={{ fontWeight: '600' }}>₱{parseFloat(transactionResult.paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="receipt-item" style={{ color: 'var(--success)' }}>
              <span>Change</span>
              <span style={{ fontWeight: '700' }}>₱{transactionResult.change.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="receipt-divider"></div>

            <div style={{ fontSize: '11px', color: 'var(--slate-400)' }}>
              {transactionResult.date}
              <div style={{ marginTop: '4px' }}>Thank you! Come again!</div>
            </div>
          </div>

          <button 
            className="premium-btn"
            style={{ width: '100%', height: '52px', marginTop: '32px', borderRadius: '14px', fontSize: '15px' }}
            onClick={onClose}
          >
            New Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
