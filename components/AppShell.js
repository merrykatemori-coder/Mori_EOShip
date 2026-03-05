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
        style={{ background: 'linear-gradient(135deg, #2d1b4e 0%, #4a2d7a 50%, #3b2060 100%)', height: 50, boxShadow: '0 2px 10px rgba(45,27,78,.25)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="Logo" style={{ height: 32, filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.3))' }} />
          <h1 className="text-white text-sm sm:text-base font-semibold tracking-wide">Mori EOShip</h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full hidden sm:inline" style={{ background: 'var(--latte)', color: 'white' }}>{role}</span>
          <button onClick={logout} className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium hover:opacity-80 transition-opacity">
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
