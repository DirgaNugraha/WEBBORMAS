import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import IconPicker from '../../components/admin/Iconpicker';
import { adminService } from '../../services/Adminservice';
import { getIcon } from '../../lib/icons';
import type { ProgramItem } from '../../types';

const emptyForm = { judul: '', deskripsi: '', icon: 'TrendingUp', progress: 0 as number | '', urutan: 0 as number | '' };

function ProgramAdmin() {
  const [list, setList] = useState<(ProgramItem & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<ProgramItem & { id: string }>('program_kelurahan', 'urutan', true);
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
    setForm({ judul: item.judul, deskripsi: item.deskripsi ?? '', icon: item.icon, progress: item.progress, urutan: item.urutan ?? 0 });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.judul.trim()) { setFormError('Judul wajib diisi.'); return; }
    setSaving(true);
    setFormError('');

    const payload = {
      ...form,
      progress: form.progress === '' ? 0 : Number(form.progress),
      urutan: form.urutan === '' ? 0 : Number(form.urutan),
    };

    const { error } = editingId
      ? await adminService.update('program_kelurahan', editingId, payload)
      : await adminService.create('program_kelurahan', payload);
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan data.'); return; }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('program_kelurahan', deleteId);
    setDeleteId(null);
    loadData();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Program Unggulan</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola program kerja kelurahan beserta progresnya</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Tambah Program</button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-6">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-6">Belum ada program.</p>
        ) : (
          list.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.id} className="card p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shrink-0">
                  <Icon className="w-5.5 h-5.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{item.judul}</p>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 shrink-0">{item.progress}%</span>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-950/50 dark:hover:text-primary-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(item.id)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">{editingId ? 'Edit Program' : 'Tambah Program'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Judul</label>
              <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi</label>
              <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3} className="input-field resize-none" />
            </div>
            <IconPicker label="Ikon" value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Progress (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') { setForm({ ...form, progress: '' }); return; }
                  const parsed = Number(val);
                  if (!Number.isNaN(parsed)) setForm({ ...form, progress: parsed });
                }}
                onBlur={() => {
                  if (form.progress === '') setForm((f) => ({ ...f, progress: 0 }));
                }}
                className="input-field"
              />
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus program ini?</h2>
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

export default ProgramAdmin;