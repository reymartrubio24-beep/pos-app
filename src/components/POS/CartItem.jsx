import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--slate-800)', marginBottom: '2px' }}>{item.name}</div>
        <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '700' }}>₱{parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--slate-50)', borderRadius: '10px', padding: '2px' }}>
          <button 
            onClick={() => onUpdateQuantity(item.id, -1, item.stock)} 
            style={{ width: '28px', height: '28px', border: 'none', background: 'var(--card-bg)', borderRadius: '8px', cursor: 'pointer', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--card-shadow)' }}
          >
            <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" />
            </svg>
          </button>
          <span style={{ fontSize: '13px', fontWeight: '700', width: '30px', textAlign: 'center', color: 'var(--text-main)' }}>{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item.id, 1, item.stock)} 
            style={{ width: '28px', height: '28px', border: 'none', background: 'var(--card-bg)', borderRadius: '8px', cursor: 'pointer', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--card-shadow)' }}
          >
            <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <button 
          onClick={() => onRemove(item.id)} 
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--slate-300)', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--slate-300)'}
        >
          <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
