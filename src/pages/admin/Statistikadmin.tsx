import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import IconPicker from '../../components/admin/Iconpicker';
import { adminService } from '../../services/Adminservice';
import { getIcon } from '../../lib/icons';
import type { StatItem } from '../../types';

const colorOptions = ['primary', 'secondary', 'accent'];
const emptyForm = { label: '', value: '', icon: 'Users', color: 'primary', urutan: 0 as number | '' };

function StatistikAdmin() {
  const [list, setList] = useState<(StatItem & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<StatItem & { id: string }>('statistik_beranda', 'urutan', true);
    setList(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, urutan: list.length + 1 });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ label: item.label, value: item.value, icon: item.icon, color: item.color, urutan: item.urutan ?? 0 });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.label.trim() || !form.value.trim()) {
      setFormError('Label dan nilai wajib diisi.');
      return;
    }
    setSaving(true);
    setFormError('');

    const payload = {
      ...form,
      urutan: form.urutan === '' ? 0 : Number(form.urutan),
    };

    const { error } = editingId
      ? await adminService.update('statistik_beranda', editingId, payload)
      : await adminService.create('statistik_beranda', payload);
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan data.'); return; }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('statistik_beranda', deleteId);
    setDeleteId(null);
    loadData();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Statistik Beranda</h1>
          <p className="text-slate-500 dark:text-slate-400">4 kartu statistik yang tampil di halaman utama</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Tambah Statistik</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-6">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-6">Belum ada data.</p>
        ) : (
          list.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.id} className="card p-5">
                <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                <div className="text-xl font-bold text-slate-900 dark:text-white">{item.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">{item.label}</div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                  <button onClick={() => setDeleteId(item.id)} className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">{editingId ? 'Edit Statistik' : 'Tambah Statistik'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Label</label>
              <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="contoh: Jumlah Penduduk" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nilai</label>
              <input type="text" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="contoh: 4.520" className="input-field" />
            </div>
            <IconPicker label="Ikon" value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Warna</label>
              <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="input-field">
                {colorOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Urutan Tampil</label>
              <input
                type="number"
                value={form.urutan}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') { setForm({ ...form, urutan: '' }); return; }
                  const parsed = Number(val);
                  if (!Number.isNaN(parsed)) setForm({ ...form, urutan: parsed });
                }}
                onBlur={() => {
                  if (form.urutan === '') setForm((f) => ({ ...f, urutan: 0 }));
                }}
                className="input-field"
              />
            </div>
            {formError && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-sm">{formError}</div>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="btn-outline flex-1">Batal</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)}>
        <div className="p-6 md:p-8 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus statistik ini?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Tindakan ini tidak bisa dibatalkan.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Batal</button>
            <button onClick={handleDelete} className="btn-primary flex-1 !bg-red-600 hover:!bg-red-700">Hapus</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default StatistikAdmin;