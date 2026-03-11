'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import DatePicker from '@/components/DatePicker';
import { hasPermission } from '@/lib/permissions';

const fmt = (n) => (parseFloat(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function DashboardPage() {
  const [totalTHB, setTotalTHB] = useState(0);
  const [totalMNT, setTotalMNT] = useState(0);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [client, setClient] = useState('');
  const [clients, setClients] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('tolun_user');
    if (stored) setRole(JSON.parse(stored).role);
    loadClients();
  }, []);

  useEffect(() => { loadDash(); }, [dateFrom, dateTo, client]);

  const loadClients = async () => { const res = await fetch('/api/clients'); const data = await res.json(); setClients(Array.isArray(data) ? data : []); };

  const loadDash = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    if (client) params.set('client', client);
    const res = await fetch(`/api/dashboard?${params}`);
    const data = await res.json();
    setTotalTHB(data.totalTHB || 0);
    setTotalMNT(data.totalMNT || 0);
    setLoading(false);
  };

  const resetFilter = () => { setDateFrom(''); setDateTo(''); setClient(''); };

  const goTo = (path) => { router.push(path); };

  const quickItems = [
    { label: 'Export', icon: 'local_shipping', path: '/export', perm: 'export_view' },
    { label: 'Export Form', icon: 'receipt_long', path: '/export-form', perm: 'export_view' },
    { label: 'Client', icon: 'people', path: '/client', perm: 'client_view' },
    { label: 'Note', icon: 'description', path: '/note', perm: 'note_view' },
    { label: 'Users', icon: 'admin_panel_settings', path: '/users', perm: 'users_view' },
    { label: 'Settings', icon: 'tune', path: '/settings', perm: 'settings_view' },
  ];

  const cardStyle = { padding: 24, borderRadius: 16, borderLeft: '4px solid', background: 'var(--card-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 20px rgba(124,58,237,0.06)' };
  const miniSpinner = <div className="flex items-center gap-2"><div className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} /></div>;

  return (
    <AppShell>
      <div className="fade-in">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Dashboard</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>From</span>
            <div className="flex-1 sm:flex-none" style={{ width: 'auto', minWidth: 140 }}><DatePicker value={dateFrom} onChange={setDateFrom} placeholder="Start date" /></div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>To</span>
            <div className="flex-1 sm:flex-none" style={{ width: 'auto', minWidth: 140 }}><DatePicker value={dateTo} onChange={setDateTo} placeholder="End date" /></div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select value={client} onChange={(e) => setClient(e.target.value)} className="px-3.5 py-2.5 rounded-lg text-sm outline-none flex-1 sm:flex-none" style={{ border: '1.5px solid var(--border)', background: 'white' }}>
              <option value="">All Clients</option>
              {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <button onClick={resetFilter} className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 whitespace-nowrap" style={{ background: 'var(--latte)', color: 'white' }}>Reset</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div style={{ padding: '20px 24px', borderRadius: 16, background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)', color: 'white', boxShadow: '0 4px 24px rgba(124,58,237,0.25)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div className="text-sm font-semibold mb-2" style={{ opacity: 0.85 }}>Total Sales (THB)</div>
            {loading ? miniSpinner : <div className="text-3xl font-bold">฿ {fmt(totalTHB)}</div>}
          </div>
          <div style={{ padding: '20px 24px', borderRadius: 16, background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', boxShadow: '0 4px 24px rgba(168,85,247,0.25)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div className="text-sm font-semibold mb-2" style={{ opacity: 0.85 }}>Total Sales (MNT)</div>
            {loading ? miniSpinner : <div className="text-3xl font-bold">₮ {fmt(totalMNT)}</div>}
          </div>
        </div>

        <h3 className="text-base font-bold mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3.5">
          {quickItems.map(item => (
            hasPermission(role, item.perm) && (
              <Link key={item.label} href={item.path} className="neon-module-card rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all hover:-translate-y-1.5 block" style={{ background: 'linear-gradient(145deg, #7c3aed 0%, #6366f1 50%, #0ea5e9 100%)', border: '1.5px solid rgba(168,85,247,0.3)', boxShadow: '0 4px 24px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.15)', textDecoration: 'none' }}>
                <div className="flex items-center justify-center mx-auto mb-2 sm:mb-3" style={{ width: 48, height: 48, color: 'white', filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.5))' }}>
                  <span className="material-icons-outlined" style={{ fontSize: 28 }}>{item.icon}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>{item.label}</span>
              </Link>
            )
          ))}
        </div>
      </div>
    </AppShell>
  );
}
