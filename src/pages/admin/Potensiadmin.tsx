import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/admin/Imageupload';
import IconPicker from '../../components/admin/Iconpicker';
import { adminService } from '../../services/Adminservice';
import { getIcon } from '../../lib/icons';
import type { Potensi } from '../../types';

const emptyForm = { nama: '', kategori: '', deskripsi: '', gambar: '', icon: 'Sprout' };

function PotensiAdmin() {
  const [list, setList] = useState<Potensi[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<Potensi>('potensi_kelurahan');
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

  const openEdit = (item: Potensi) => {
    setEditingId(item.id);
    setForm({ nama: item.nama, kategori: item.kategori, deskripsi: item.deskripsi ?? '', gambar: item.gambar ?? '', icon: item.icon });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama.trim() || !form.kategori.trim()) { setFormError('Nama dan kategori wajib diisi.'); return; }
    setSaving(true);
    setFormError('');
    const { error } = editingId
      ? await adminService.update('potensi_kelurahan', editingId, form)
      : await adminService.create('potensi_kelurahan', form);
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan data.'); return; }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('potensi_kelurahan', deleteId);
    setDeleteId(null);
    loadData();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Potensi Kelurahan</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola potensi pertanian, perikanan, UMKM, wisata, dll</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Tambah Potensi</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-6">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-6">Belum ada data potensi.</p>
        ) : (
          list.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.id} className="card overflow-hidden">
                {item.gambar && (
                  <div className="aspect-video overflow-hidden">
                    <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300">{item.kategori}</span>
                  </div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white mb-2">{item.nama}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                    <button onClick={() => setDeleteId(item.id)} className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">{editingId ? 'Edit Potensi' : 'Tambah Potensi'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama</label>
              <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kategori</label>
              <input type="text" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} placeholder="contoh: Pertanian, Perikanan, UMKM, Wisata" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi</label>
              <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3} className="input-field resize-none" />
            </div>
            <ImageUpload label="Gambar" value={form.gambar} onChange={(url) => setForm({ ...form, gambar: url })} folder="potensi" />
            <IconPicker label="Ikon" value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus potensi ini?</h2>
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

export default PotensiAdmin;