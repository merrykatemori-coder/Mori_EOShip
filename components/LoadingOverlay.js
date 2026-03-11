'use client';

export default function LoadingOverlay({ show, message }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(8,14,30,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, border: '3.5px solid rgba(79,110,247,0.15)',
        borderTopColor: '#00d4ff', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.4))',
      }} />
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
        {message || 'Loading...'}
      </span>
    </div>
  );
}
