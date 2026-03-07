import React from 'react';
import CartItem from './CartItem';

const Cart = ({ cart, user, onUpdateQuantity, onRemove, onClear, onCheckout, subtotal, vat, total }) => {
  return (
    <div className="premium-card pos-cart-section">
      <div className="cart-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '20px', height: '20px', color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Current Order</h2>
            <p style={{ fontSize: '12px', color: 'var(--slate-400)' }}>{cart.length} items added</p>
          </div>
        </div>
        {cart.length > 0 && (
           <button 
              onClick={onClear}
              style={{ background: 'var(--danger-light)', border: 'none', color: 'var(--danger)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
              title="Clear Cart"
           >
              <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
           </button>
        )}
      </div>

      <div className="cart-items-container">
         {cart.length === 0 ? (
           <div className="empty-cart-state">
              <div style={{ width: '80px', height: '80px', background: 'var(--slate-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg style={{ width: '40px', height: '40px', color: 'var(--slate-200)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', color: 'var(--slate-900)', fontWeight: '600', marginBottom: '4px' }}>Empty Cart</h3>
              <p style={{ fontSize: '13px', color: 'var(--slate-400)' }}>Choose products from the left to start a transaction</p>
           </div>
         ) : (
           <div>
              {cart.map(item => (
                 <CartItem 
                   key={item.id} 
                   item={item} 
                   onUpdateQuantity={onUpdateQuantity} 
                   onRemove={onRemove} 
                 />
              ))}
           </div>
         )}
      </div>

      <div className="cart-summary">
         <div className="summary-details">
            <div className="summary-row">
               <span>Subtotal</span>
               <span>₱{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-row">
               <span>VAT (12%)</span>
               <span>₱{vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-total">
               <span>Total Pay</span>
               <span>₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
         </div>
         
         <button 
            className="process-payment-btn" 
            disabled={cart.length === 0}
            onClick={onCheckout}
         >
            PROCESS PAYMENT
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
         </button>
         <div className="cashier-info">
           Cashier: {user?.full_name || 'System User'}
         </div>
      </div>
    </div>
  );
};

export default Cart;
