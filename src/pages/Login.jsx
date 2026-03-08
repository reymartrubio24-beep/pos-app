import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('cashier');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isRegistering ? '/api/auth/register.php' : '/api/auth/login.php';
    const payload = isRegistering 
      ? { username, password, full_name: fullName, role: 'cashier' } // Hardcode to cashier
      : { username, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        if (isRegistering) {
          setIsRegistering(false);
          setError('Registration successful! Please login.');
          // Reset form
          setPassword('');
        } else {
          onLogin(data.user);
        }
      } else {
        setError(data.error || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Make sure PHP server is running. Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-main)',
      padding: '20px'
    }}>
      {/* Brand Name */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>RetailPOS</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-sub)' }}>Point of Sale & Sales Monitoring System</p>
      </div>

      <div className="premium-card" style={{ 
        width: '100%', 
        maxWidth: '440px', 
        padding: '40px', 
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--border-main)',
        background: 'var(--card-bg)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', marginBottom: isRegistering ? '12px' : '32px' }}>
          {isRegistering ? 'Create new account' : 'Sign in to your account'}
        </h2>

        {isRegistering && (
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            marginBottom: '24px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Cashier Access Only
          </div>
        )}

        {error && (
          <div style={{ 
            background: error.includes('successful') || error.includes('Recovery') ? 'var(--success-light)' : 'var(--danger-light)', 
            color: error.includes('successful') || error.includes('Recovery') ? 'var(--success)' : 'var(--danger)', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '24px', 
            fontSize: '13px', 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: `1px solid ${error.includes('successful') || error.includes('Recovery') ? 'var(--success)' : 'var(--danger)'}20`
          }}>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div style={{ marginBottom: '20px' }}>
                <label className="input-label" style={{ color: 'var(--text-sub)' }}>Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
             <label className="input-label" style={{ color: 'var(--text-sub)' }}>Username / Email</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label className="input-label" style={{ color: 'var(--text-sub)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                placeholder="••••••••" 
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
                  color: 'var(--text-sub)',
                  cursor: 'pointer',
                  opacity: 0.5
                }}
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {!isRegistering && (
            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <button 
                type="button"
                onClick={() => setError('Owner Recovery: Please contact your system provider or check your registration recovery key.')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-sub)', 
                  fontSize: '12px', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Forgot your password?
              </button>
            </div>
          )}

          <button type="submit" className="premium-btn" style={{ width: '100%', height: '44px', fontSize: '14px', fontWeight: '600', background: 'var(--success)', marginTop: isRegistering ? '12px' : '0' }} disabled={loading}>
            {loading ? <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }}></div> : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
          
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
              {isRegistering ? 'Already have an account?' : "Don't have an account?"} {' '}
              <button 
                type="button" 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--success)', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '13px'
                }}
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
              >
                {isRegistering ? 'Sign In' : 'Create an Account'}
              </button>
            </p>
          </div>
        </form>
      </div>
      
      <p style={{ marginTop: '32px', fontSize: '12px', color: 'var(--text-sub)' }}>RetailPOS Ika 3 nga Version • Small Retail Store Management System</p>
    </div>
  );
};

export default Login;
