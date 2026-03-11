'use client';

export default function LoadingOverlay({ show, message }) {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, border: '3.5px solid rgba(124,58,237,0.15)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.7s linear infinite', filter: 'drop-shadow(0 0 6px rgba(124,58,237,0.3))' }} />
      <span style={{ fontSize: 14, fontWeight: 500, color: '#5b4a78' }}>{message || 'Loading...'}</span>
    </div>
  );
}
