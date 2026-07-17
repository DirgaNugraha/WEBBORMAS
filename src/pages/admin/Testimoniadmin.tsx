import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/admin/Imageupload';
import { adminService } from '../../services/Adminservice';
import type { TestimonialItem } from '../../types';

const emptyForm = { nama: '', peran: '', pesan: '', avatar: '', urutan: 0 as number | '' };

function TestimoniAdmin() {
  const [list, setList] = useState<(TestimonialItem & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<TestimonialItem & { id: string }>('testimoni', 'urutan', true);
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
    setForm({ nama: item.nama, peran: item.peran ?? '', pesan: item.pesan, avatar: item.avatar ?? '', urutan: item.urutan ?? 0 });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama.trim() || !form.pesan.trim()) { setFormError('Nama dan pesan wajib diisi.'); return; }
    setSaving(true);
    setFormError('');

    const payload = {
      ...form,
      urutan: form.urutan === '' ? 0 : Number(form.urutan),
    };

    const { error } = editingId
      ? await adminService.update('testimoni', editingId, payload)
      : await adminService.create('testimoni', payload);
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan data.'); return; }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('testimoni', deleteId);
    setDeleteId(null);
    loadData();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Testimoni</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola testimoni warga di halaman beranda</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Tambah Testimoni</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-6">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-6">Belum ada testimoni.</p>
        ) : (
          list.map((item) => (
            <div key={item.id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <img src={item.avatar || 'https://placehold.co/60x60?text=Foto'} alt={item.nama} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{item.nama}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.peran}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">{item.pesan}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => setDeleteId(item.id)} className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">{editingId ? 'Edit Testimoni' : 'Tambah Testimoni'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama</label>
              <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Peran</label>
              <input type="text" value={form.peran} onChange={(e) => setForm({ ...form, peran: e.target.value })} placeholder="contoh: Warga Dusun Tengah" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pesan</label>
              <textarea value={form.pesan} onChange={(e) => setForm({ ...form, pesan: e.target.value })} rows={3} className="input-field resize-none" />
            </div>
            <ImageUpload label="Foto/Avatar" value={form.avatar} onChange={(url) => setForm({ ...form, avatar: url })} folder="testimoni" />
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus testimoni ini?</h2>
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

export default TestimoniAdmin;