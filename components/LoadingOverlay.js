'use client';

export default function LoadingOverlay({ show, message }) {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,14,42,0.7)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, border: '3.5px solid rgba(167,139,250,0.15)', borderTopColor: '#a78bfa', borderRadius: '50%', animation: 'spin 0.7s linear infinite', filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.4))' }} />
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{message || 'Loading...'}</span>
    </div>
  );
}
