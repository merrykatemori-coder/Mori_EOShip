'use client';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: 'rgba(45,22,84,0.15)', backdropFilter: 'blur(6px)' }}>
      <div className="rounded-xl p-8 max-w-sm text-center modal-animate">
        <h4 className="text-base font-bold mb-2" style={{ color: '#2d1654' }}>{title}</h4>
        <p className="text-sm mb-6" style={{ color: '#5b4a78' }}>{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all" style={{ border: '1px solid rgba(124,58,237,0.12)', color: '#5b4a78', background: 'transparent' }}>Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all" style={{ background: '#ef4444', boxShadow: '0 4px 12px rgba(239,68,68,0.25)' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}
