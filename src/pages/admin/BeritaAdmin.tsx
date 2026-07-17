import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/admin/Imageupload';
import { adminService } from '../../services/Adminservice';
import { formatDate } from '../../lib/format';
import type { Berita } from '../../types';

const emptyForm = {
  judul: '',
  kategori: 'Umum',
  excerpt: '',
  konten: '',
  gambar: '',
  tanggal: new Date().toISOString().slice(0, 16),
  penulis: 'Admin Kelurahan',
};

function BeritaAdmin() {
  const [list, setList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<Berita>('berita', 'tanggal');
    setList(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item: Berita) => {
    setEditingId(item.id);
    setForm({
      judul: item.judul,
      kategori: item.kategori,
      excerpt: item.excerpt ?? '',
      konten: item.konten,
      gambar: item.gambar ?? '',
      tanggal: item.tanggal.slice(0, 16),
      penulis: item.penulis,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.judul.trim() || !form.konten.trim()) {
      setFormError('Judul dan konten wajib diisi.');
      return;
    }

    setSaving(true);
    setFormError('');

    const payload = { ...form, tanggal: new Date(form.tanggal).toISOString() };

    const { error } = editingId
      ? await adminService.update('berita', editingId, payload)
      : await adminService.create('berita', payload);

    setSaving(false);

    if (error) {
      setFormError('Gagal menyimpan data. Coba lagi.');
      return;
    }

    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('berita', deleteId);
    setDeleteId(null);
    loadData();
  };

  const filtered = list.filter((b) => b.judul.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Berita</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola berita dan pengumuman kelurahan</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Tambah Berita
        </button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul berita..."
          className="input-field pl-10"
        />
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-slate-500 dark:text-slate-400">Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-center text-slate-500 dark:text-slate-400">Belum ada berita.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Judul</th>
                  <th className="text-left font-medium px-4 py-3">Kategori</th>
                  <th className="text-left font-medium px-4 py-3">Tanggal</th>
                  <th className="text-right font-medium px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {item.judul}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(item.tanggal)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-950/50 dark:hover:text-primary-400 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal form tambah/edit */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
            {editingId ? 'Edit Berita' : 'Tambah Berita'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Judul</label>
              <input
                type="text"
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kategori</label>
                <select
                  value={form.kategori}
                  onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                  className="input-field"
                >
                  <option value="Umum">Umum</option>
                  <option value="Pengumuman">Pengumuman</option>
                  <option value="Kegiatan">Kegiatan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tanggal Publish</label>
                <input
                  type="datetime-local"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ringkasan</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Konten</label>
              <textarea
                value={form.konten}
                onChange={(e) => setForm({ ...form, konten: e.target.value })}
                rows={6}
                className="input-field resize-none"
              />
            </div>

            <ImageUpload
              label="Gambar"
              value={form.gambar}
              onChange={(url) => setForm({ ...form, gambar: url })}
              folder="berita"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Penulis</label>
              <input
                type="text"
                value={form.penulis}
                onChange={(e) => setForm({ ...form, penulis: e.target.value })}
                className="input-field"
              />
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-sm">
                {formError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="btn-outline flex-1">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal konfirmasi hapus */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)}>
        <div className="p-6 md:p-8 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus berita ini?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Tindakan ini tidak bisa dibatalkan.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Batal</button>
            <button onClick={handleDelete} className="btn-primary flex-1 !bg-red-600 hover:!bg-red-700">
              Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BeritaAdmin;