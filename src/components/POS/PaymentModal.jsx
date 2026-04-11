import React from 'react';

const PaymentModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  subtotal, 
  vat, 
  total, 
  paymentMethod, 
  setPaymentMethod, 
  amountReceived, 
  setAmountReceived, 
  isProcessing 
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--slate-900)' }}>Payment</h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="payment-summary-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--slate-500)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '600', color: 'var(--slate-700)' }}>₱{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: 'var(--slate-500)' }}>
              <span>VAT (12%)</span>
              <span style={{ fontWeight: '600', color: 'var(--slate-700)' }}>₱{vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--slate-200)', paddingTop: '16px' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--slate-900)' }}>Total</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Payment Method</div>
          <div className="payment-method-toggle" style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
            <button 
              className="method-btn active"
              style={{ cursor: 'default' }}
              disabled
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cash
            </button>
          </div>

          {paymentMethod === 'Cash' && (
            <div className="amount-input-wrapper">
              <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Amount Received</div>
              <input 
                type="number" 
                className="amount-input" 
                placeholder="0.00"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {paymentMethod === 'Cash' && (
            <div className="quick-amounts">
              {[50, 100, 200, 500].map(amt => (
                <button key={amt} className="quick-btn" onClick={() => setAmountReceived(amt.toString())}>
                  ₱{amt}
                </button>
              ))}
            </div>
          )}

          <button 
            className="confirm-payment-btn"
            disabled={isProcessing || (paymentMethod === 'Cash' && !amountReceived)}
            onClick={onConfirm}
          >
            {isProcessing ? (
              <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }}></div>
            ) : (
              <>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Confirm Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
