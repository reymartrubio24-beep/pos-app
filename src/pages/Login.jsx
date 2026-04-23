import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: 'var(--bg-main)',
      background: 'radial-gradient(circle at top right, var(--primary-light), transparent), radial-gradient(circle at bottom left, var(--success-light), transparent)',
      padding: '20px',
      fontFamily: 'var(--font-main)',
      overflow: 'hidden'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.02em' }}>Retail<span style={{ color: 'var(--primary)' }}>POS</span></h1>
          <p style={{ fontSize: '14px', color: 'var(--text-sub)', fontWeight: '500' }}>Management System Ika V1.0</p>
        </div>

        <div className="premium-card" style={{ 
          padding: '40px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -6px rgba(0, 0, 0, 0.04)',
          border: '1px solid var(--border-main)',
          background: 'var(--card-bg)',
          borderRadius: '24px'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>Welcome back</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>Please enter your details to sign in.</p>
          </div>

          {error && (
            <div style={{ 
              background: error.includes('Recovery') ? 'var(--success-light)' : 'var(--danger-light)', 
              color: error.includes('Recovery') ? 'var(--success)' : 'var(--danger)', 
              padding: '12px 16px', 
              borderRadius: '12px', 
              marginBottom: '24px', 
              fontSize: '13px', 
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: `1px solid ${error.includes('Recovery') ? 'var(--success)' : 'var(--danger)'}20`
            }}>
              <svg style={{ width: '18px', height: '18px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontWeight: '500' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label className="input-label" style={{ marginBottom: '8px', color: 'var(--text-main)', fontWeight: '600' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }}>
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="name@example.com" 
                  style={{ paddingLeft: '44px', height: '48px', backgroundColor: 'var(--slate-50)' }}
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                 <label className="input-label" style={{ marginBottom: 0, color: 'var(--text-main)', fontWeight: '600' }}>Password</label>
                 <button 
                  type="button"
                  onClick={() => setError('Contact Admin for password recovery.')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase' }}
                >
                  Forgot?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }}>
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="input-field" 
                  placeholder="••••••••" 
                  style={{ paddingLeft: '44px', paddingRight: '44px', height: '48px', backgroundColor: 'var(--slate-50)' }}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--slate-400)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <button 
                type="submit" 
                className="premium-btn" 
                style={{ 
                  width: '100%', 
                  height: '52px', 
                  fontSize: '15px', 
                  fontWeight: '700', 
                  background: 'var(--primary)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                  borderRadius: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }} 
                disabled={loading}
              >
                {loading ? <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }}></div> : 'Login '}
              </button>
            </div>
          </form>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
           <p style={{ fontSize: '11px', color: 'var(--text-sub)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
             © 2026 RetailPOS System • v1.0 Early Access
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
