'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Toast from '@/components/Toast';
import LoadingOverlay from '@/components/LoadingOverlay';

const CATEGORIES = [
  { key: 'item_types', label: 'Item Types', module: 'Export - Box Item' },
  { key: 'box_types', label: 'Box Types', module: 'Export' },
  { key: 'origin_destination', label: 'Origin-Destination', module: 'Client' },
  { key: 'nationality', label: 'Nationality', module: 'Client' },
  { key: 'gender', label: 'Gender', module: 'Client' },
  { key: 'contact_channel', label: 'Contact Channel', module: 'Client' },
  { key: 'service_type', label: 'Service Type', module: 'Export Form' },
  { key: 'payment_status', label: 'Payment Status', module: 'Export' },
  { key: 'ef_box_type', label: 'Export Form Box Type', module: 'Export Form' },
];

export default function SettingsPage() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('item_types');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ label: '', value: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const dragNode = useRef(null);
  const router = useRouter();
  const goBack = () => { router.push('/dashboard'); };

  const loadData = async () => { setLoading(true); const res = await fetch('/api/dropdown-settings'); const data = await res.json(); setAllData(Array.isArray(data) ? data : []); setLoading(false); };
  useEffect(() => { loadData(); }, []);

  const items = allData.filter(d => d.category === activeTab).sort((a, b) => a.sort_order - b.sort_order);
  const activeCat = CATEGORIES.find(c => c.key === activeTab);

  const openAdd = () => { setEditItem(null); setForm({ label: '', value: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ label: item.label, value: item.value }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.label) { setToast({ msg: 'Please enter label', type: 'error' }); return; }
    setSaving(true);
    const val = form.value || form.label;
    if (editItem) {
      await fetch('/api/dropdown-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editItem.id, label: form.label, value: val }) });
    } else {
      const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) : 0;
      await fetch('/api/dropdown-settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: activeTab, label: form.label, value: val, sort_order: maxOrder + 1, module: activeCat?.module || '' }) });
    }
    setSaving(false); setModalOpen(false); setToast({ msg: editItem ? 'Updated' : 'Added', type: 'success' }); loadData();
  };

  const handleDelete = async () => { setSaving(true); await fetch(`/api/dropdown-settings?id=${deleteTarget.id}`, { method: 'DELETE' }); setSaving(false); setConfirmOpen(false); setToast({ msg: 'Deleted', type: 'success' }); loadData(); };

  const handleDragStart = (e, idx) => {
    dragNode.current = e.target;
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (dragNode.current) dragNode.current.style.opacity = '0.4'; }, 0);
  };

  const handleDragOver = (e, idx) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOverIdx(idx); };

  const handleDragEnd = async () => {
    if (dragNode.current) dragNode.current.style.opacity = '1';
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const arr = [...items];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(overIdx, 0, moved);
      const updated = arr.map((item, i) => ({ ...item, sort_order: i + 1 }));
      setAllData(prev => prev.map(d => { const found = updated.find(u => u.id === d.id); return found ? { ...d, sort_order: found.sort_order } : d; }));
      await fetch('/api/dropdown-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bulk: true, items: updated.map(i => ({ id: i.id, label: i.label, value: i.value, sort_order: i.sort_order })) }) });
    }
    setDragIdx(null); setOverIdx(null); dragNode.current = null;
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all";
  const inputStyle = { border: '1px solid var(--glass-border)' };

  return (
    <AppShell>
      <LoadingOverlay show={saving} message="Processing..." />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
            <Link href="/dashboard" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ borderColor: "var(--border)" }}><span className="material-icons-outlined" style={{ fontSize: 20 }}>arrow_back</span></Link>
            Dropdown Settings
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveTab(cat.key)} className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all" style={{ background: activeTab === cat.key ? 'var(--latte)' : 'white', color: activeTab === cat.key ? 'white' : 'var(--text-secondary)', border: `1.5px solid ${activeTab === cat.key ? 'var(--latte)' : 'var(--border)'}` }}>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(79,110,247,0.06)', borderBottom: '1.5px solid var(--border)' }}>
            <div>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{activeCat?.label}</span>
              <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>({activeCat?.module})</span>
            </div>
            <button onClick={openAdd} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--latte)' }}>+ Add</button>
          </div>

          {loading ? <div className="flex justify-center py-10"><div className="spinner" /></div>
          : items.length === 0 ? <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}><span className="material-icons-outlined block mb-2" style={{ fontSize: 36 }}>playlist_add</span><span className="text-sm">No items yet</span></div>
          : <div>{items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              onDragLeave={() => setOverIdx(null)}
              className="flex items-center gap-3 px-4 py-3 transition-all"
              style={{
                borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
                borderTop: overIdx === idx && dragIdx !== null && dragIdx !== idx ? '2.5px solid var(--latte)' : '2.5px solid transparent',
                cursor: 'grab',
                background: dragIdx === idx ? 'var(--cream)' : 'transparent',
              }}
            >
              <span className="material-icons-outlined" style={{ fontSize: 18, color: 'var(--grey)', cursor: 'grab' }}>drag_indicator</span>
              <span className="text-xs font-mono w-6 text-center" style={{ color: 'var(--text-muted)' }}>{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{item.label}</span>
                {item.value !== item.label && <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>({item.value})</span>}
              </div>
              <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: 'var(--info)' }}><span className="material-icons-outlined" style={{ fontSize: 16 }}>edit</span></button>
              <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); setConfirmOpen(true); }} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: 'var(--danger)' }}><span className="material-icons-outlined" style={{ fontSize: 16 }}>delete</span></button>
            </div>
          ))}</div>}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Item' : 'Add Item'} footer={<>
        <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--latte)' }}>Save</button>
      </>}>
        <div className="mb-4"><label className="block text-sm font-semibold mb-1.5">Label *</label><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inputCls} style={inputStyle} /></div>
        <div className="mb-4"><label className="block text-sm font-semibold mb-1.5">Value</label><input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="Same as label if empty" className={inputCls} style={inputStyle} /></div>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} title="Delete Item" message={`Delete "${deleteTarget?.label}"?`} onConfirm={handleDelete} onCancel={() => setConfirmOpen(false)} />
    </AppShell>
  );
}
