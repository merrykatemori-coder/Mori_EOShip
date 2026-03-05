export default function Loading() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, border: '3.5px solid #e0d8ee',
        borderTopColor: '#9b6ddb', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <span style={{ fontSize: 14, fontWeight: 500, color: '#6b5f80' }}>Loading...</span>
    </div>
  );
}
