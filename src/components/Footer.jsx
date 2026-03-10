import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <button
        type="button"
        className="footer-logo"
        onClick={() => {}}
      >
        <img 
          src="public/uploads/logo3.png" 
          alt="RetailPOS Logo" 
        />
        <span style={{ fontWeight: '1000' }}>Rey-Dev</span>
      </button>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '12px', fontWeight: '500' }}>Kapoyag buhat Systema</span>
        </div>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;

