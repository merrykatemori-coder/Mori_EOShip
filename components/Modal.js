'use client';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(45,22,84,0.15)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div className="modal-animate w-full max-w-[520px] max-h-[85vh] overflow-y-auto sm:rounded-2xl sm:w-[90%]" style={{ maxHeight: '100vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b sticky top-0 sm:rounded-t-2xl z-10" style={{ borderColor: 'rgba(124,58,237,0.08)', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)' }}>
          <h3 className="text-base sm:text-lg font-bold" style={{ color: '#2d1654' }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: 'rgba(124,58,237,0.06)', color: '#5b4a78' }}>
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-5">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t sticky bottom-0 sm:rounded-b-2xl" style={{ borderColor: 'rgba(124,58,237,0.08)', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
