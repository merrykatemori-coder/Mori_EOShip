'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('Please enter username and password'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.user) {
        sessionStorage.setItem('tolun_user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch {
      setError('Connection error');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)', backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(79,110,247,0.06) 0%, transparent 70%)' }}>
      <form onSubmit={handleLogin} className="rounded-2xl p-8 sm:p-12 w-full max-w-md mx-3 sm:mx-0 text-center" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(79,110,247,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(79,110,247,0.1)' }}>
        <img src="/logo.png" alt="Logo" style={{ width: 60, marginBottom: 12, marginLeft: 'auto', marginRight: 'auto', display: 'block' }} />
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#0f1b3d' }}>Mori EOShip</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>

        <div className="text-left mb-4">
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm transition-all outline-none"
            style={{ border: '1px solid rgba(79,110,247,0.12)', background: 'rgba(255,255,255,0.9)' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--latte)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            placeholder="Enter username"
          />
        </div>

        <div className="text-left mb-6">
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm transition-all outline-none"
            style={{ border: '1px solid rgba(79,110,247,0.12)', background: 'rgba(255,255,255,0.9)' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--latte)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            placeholder="Enter password"
          />
        </div>

        {error && <p className="text-sm mb-4" style={{ color: 'var(--danger)' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all"
          style={{ background: loading ? 'var(--grey)' : 'linear-gradient(135deg, #4f6ef7, #00d4ff)', boxShadow: loading ? 'none' : '0 4px 20px rgba(79,110,247,0.3)' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
