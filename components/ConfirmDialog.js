'use client';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div className="rounded-xl p-8 max-w-sm text-center modal-animate" style={{ background: 'linear-gradient(180deg, #0f1a30, #0a1222)', border: '1px solid rgba(255,77,106,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(255,77,106,0.08)' }}>
        <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h4>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all" style={{ border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', background: 'transparent' }}>Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all" style={{ background: 'var(--danger)', boxShadow: '0 4px 16px rgba(255,77,106,0.3)' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}
