import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { BACKEND_URL } from '../../config';
import PrimaryButton from '../ui/PrimaryButton';

const LoginForm = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'request' | 'registerOwner'
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (mode === 'registerOwner') {
      if (!username || !password) {
        alert('Please enter a username and password for the new owner account.');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
    }

    setLoadingLogin(true);
    let notified = false;
    try {
      if (mode === 'login') {
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = (data && data.error) ? data.error : 'Login failed. Please check credentials.';
          alert(msg);
          notified = true;
        } else {
          onSuccess(data);
        }
      } else if (mode === 'request') {
        const res = await fetch(`${BACKEND_URL}/api/auth/request-reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = (data && data.error) ? data.error : 'Unable to request reset.';
          Promise.resolve().then(() => { try { alert(msg); } catch {} });
          notified = true;
        } else {
          alert('Password reset requested. Check console/log for token.');
          setMode('login');
        }
      } else if (mode === 'registerOwner') {
        const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = (data && data.error)
            ? data.error
            : 'Could not create a new owner account. Please try a different username or contact support.';
          alert(msg);
          notified = true;
        } else {
          // If backend returns a token, sign in immediately
          if (data && data.token) {
            onSuccess(data);
          } else {
            alert('New owner account created successfully. You can now log in with it.');
            setMode('login');
          }
        }
      }
    } catch {
      if (!notified) Promise.resolve().then(() => { try { alert('Login failed. Please check credentials.'); } catch {} });
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Username</label>
        <div className="relative">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-200"
            placeholder="owner"
          />
          <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
      </div>
      <div className="relative group">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {mode === 'registerOwner' ? 'New Owner Password' : 'Password'}
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-200"
            placeholder={mode === 'registerOwner' ? 'Choose a secure password' : 'owner123'}
          />
          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {mode === 'registerOwner' && (
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-200"
            placeholder="Re-enter password"
          />
        </div>
      )}
      
      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
        {mode === 'login' && (
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span>Remember me</span>
          </label>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {mode === 'login' && (
            <>
              <button
                type="button"
                onClick={() => setMode('request')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </button>
              <span className="text-gray-400">•</span>
              <button
                type="button"
                onClick={() => {
                  setMode('registerOwner');
                  setConfirmPassword('');
                }}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Owner account compromised?
              </button>
            </>
          )}
          {mode === 'request' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-auto"
            >
              Back to Login
            </button>
          )}
          {mode === 'registerOwner' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-auto"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
      <PrimaryButton
        type="submit"
        disabled={loadingLogin}
        className="w-full py-3 rounded-xl disabled:opacity-50 shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        {loadingLogin ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : mode === 'login'
          ? 'Login'
          : mode === 'request'
          ? 'Request Password Reset'
          : 'Create New Owner Account'}
      </PrimaryButton>
      <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700">
         <p className="text-xs text-center text-gray-500 dark:text-gray-400">
           <span className="font-semibold block mb-1">Username and password:</span>
           owner / owner123
         </p>
      </div>
    </form>
  );
};

export default LoginForm;
