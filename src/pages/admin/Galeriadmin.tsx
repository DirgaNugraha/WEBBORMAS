import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/admin/Imageupload';
import { adminService } from '../../services/Adminservice';
import type { GaleriItem } from '../../types';

const emptyForm = { judul: '', kategori: 'Kegiatan', gambar: '', tanggal: new Date().toISOString().slice(0, 10) };

function GaleriAdmin() {
  const [list, setList] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<GaleriItem>('galeri', 'tanggal', false);
    setList(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item: GaleriItem) => {
    setEditingId(item.id);
    setForm({ judul: item.judul, kategori: item.kategori, gambar: item.gambar, tanggal: item.tanggal.slice(0, 10) });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.judul.trim() || !form.gambar) { setFormError('Judul dan gambar wajib diisi.'); return; }
    setSaving(true);
    setFormError('');
    const payload = { ...form, tanggal: new Date(form.tanggal).toISOString() };
    const { error } = editingId
      ? await adminService.update('galeri', editingId, payload)
      : await adminService.create('galeri', payload);
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan data.'); return; }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('galeri', deleteId);
    setDeleteId(null);
    loadData();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Galeri</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola foto kegiatan dan fasilitas kelurahan</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Tambah Foto</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-6">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-6">Belum ada foto.</p>
        ) : (
          list.map((item) => (
            <div key={item.id} className="card overflow-hidden group">
              <div className="aspect-video overflow-hidden">
                <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{item.judul}</p>
                <span className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300 mt-1">{item.kategori}</span>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(item)} className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                  <button onClick={() => setDeleteId(item.id)} className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">{editingId ? 'Edit Foto' : 'Tambah Foto'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Judul</label>
              <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kategori</label>
              <input type="text" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} placeholder="contoh: Kegiatan, Fasilitas, Wisata" className="input-field" />
            </div>
            <ImageUpload label="Gambar" value={form.gambar} onChange={(url) => setForm({ ...form, gambar: url })} folder="galeri" />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tanggal</label>
              <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="input-field" />
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus foto ini?</h2>
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

export default GaleriAdmin;