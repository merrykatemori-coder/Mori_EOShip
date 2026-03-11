'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('tolun_user');
    if (!stored) { router.push('/login'); return; }
    setRole(JSON.parse(stored).role);
  }, [router]);

  const nav = (path) => {
    if (path !== pathname) router.push(path);
  };

  const logout = () => {
    sessionStorage.removeItem('tolun_user');
    router.push('/login');
  };

  return (
    <div>
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-6"
        style={{ background: 'rgba(255, 255, 255, 0.6)', height: 50, boxShadow: '0 2px 20px rgba(124,58,237,0.08)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(124,58,237,0.08)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="Logo" style={{ height: 32, filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.3))' }} />
          <h1 className="text-sm sm:text-base font-semibold tracking-wide" style={{ color: '#2d1654' }}>Mori EOShip</h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full hidden sm:inline" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.15)' }}>{role}</span>
          <button onClick={logout} className="flex items-center gap-1 text-xs sm:text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#5b4a78' }}>
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
      <div style={{ marginTop: 50 }} className="px-3 py-4 sm:px-6 sm:py-6 max-w-[1200px] mx-auto">
        {children}
      </div>
    </div>
  );
}
