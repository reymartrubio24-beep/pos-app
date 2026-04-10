import React, { useState, useEffect } from 'react';

const ConfirmModal = ({ 
  show, 
  title = 'Are you sure?', 
  message = 'This action cannot be undone.', 
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  doubleConfirm = true
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) {
      setStep(1);
      setLoading(false);
    }
  }, [show]);

  if (!show) return null;

  const handleInitialConfirm = () => {
    if (doubleConfirm) {
      setStep(2);
    } else {
      handleFinalConfirm();
    }
  };

  const handleFinalConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, animation: 'fadeIn 0.2s ease'
      }}
    >
      <div className="premium-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '360px', padding: '32px', textAlign: 'center' }}
      >
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>
          {step === 1 ? title : 'Are you really sure?'}
        </h2>
        <p style={{ color: 'var(--text-sub)', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
          {step === 1 ? message : 'This is your final confirmation. This action will be permanent.'}
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            style={{ 
              flex: 1, padding: '12px', borderRadius: '10px', 
              border: '1px solid var(--border-main)', background: 'transparent',
              color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {cancelText}
          </button>
          
          {step === 1 ? (
             <button 
                type="button" 
                onClick={handleInitialConfirm}
                style={{ 
                  flex: 1, padding: '12px', borderRadius: '10px', 
                  border: 'none', background: 'var(--danger)',
                  color: 'white', fontWeight: '600', cursor: 'pointer'
                }}
              >
                {confirmText}
              </button>
          ) : (
            <button 
              type="button" 
              onClick={handleFinalConfirm}
              disabled={loading}
              style={{ 
                flex: 1, padding: '12px', borderRadius: '10px', 
                border: 'none', background: 'var(--danger)',
                color: 'white', fontWeight: '600', cursor: 'pointer',
                animation: 'pulse 1.5s infinite'
              }}
            >
              {loading ? 'Processing...' : 'Yes, Delete Now'}
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
