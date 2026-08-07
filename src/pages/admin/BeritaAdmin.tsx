import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Plus, Pencil, Trash2, Search, Globe } from 'lucide-react';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/admin/Imageupload';
import { adminService } from '../../services/Adminservice';
import { formatDate } from '../../lib/format';
import { createBeritaSlug } from '../../lib/slug'; 
import type { Berita } from '../../types';

// Helper menyesuaikan format ISO UTC ke string YYYY-MM-THH:mm lokal untuk input datetime-local
const getLocalDatetimeString = (dateInput?: string | Date): string => {
  const date = dateInput ? new Date(dateInput) : new Date();
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const emptyForm = {
  judul: '',
  kategori: 'Umum',
  excerpt: '',
  konten: '',
  gambar: '',
  tanggal: getLocalDatetimeString(),
  penulis: 'Admin Kelurahan',
  isEksternal: false,
  namaSumber: '',
  linkAsli: '',
};

function BeritaAdmin() {
  const [list, setList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<Berita>('berita', 'tanggal');
    setList(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetFormState = () => {
    setForm({
      ...emptyForm,
      tanggal: getLocalDatetimeString(),
    });
    setFormError('');
  };

  const openCreate = () => {
    setEditingId(null);
    resetFormState();
    setModalOpen(true);
  };

  const openEdit = (item: Berita) => {
    setEditingId(item.id);
    setForm({
      judul: item.judul ?? '',
      kategori: item.kategori ?? 'Umum',
      excerpt: item.excerpt ?? '',
      konten: item.konten ?? '',
      gambar: item.gambar ?? '',
      tanggal: getLocalDatetimeString(item.tanggal),
      penulis: item.penulis ?? 'Admin Kelurahan',
      isEksternal: item.is_eksternal ?? item.isEksternal ?? false,
      namaSumber: item.nama_sumber ?? item.namaSumber ?? '',
      linkAsli: item.link_asli ?? item.linkAsli ?? '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetFormState();
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    if (!form.judul.trim() || !form.konten.trim()) {
      setFormError('Judul dan konten wajib diisi.');
      return;
    }

    if (form.isEksternal && !form.linkAsli.trim()) {
      setFormError('URL artikel asli wajib diisi untuk berita eksternal.');
      return;
    }

    setSaving(true);
    setFormError('');

    const payload = {
      judul: form.judul.trim(),
      // 🟢 PERBAIKAN: Hanya set slug jika berita baru dibuat
      // Jika edit (editingId ada), jangan kirim atribut slug
      ...( !editingId && { slug: createBeritaSlug(form.judul.trim(), form.tanggal) } ),
      kategori: form.kategori,
      excerpt: form.excerpt.trim(),
      konten: form.konten.trim(),
      gambar: form.gambar,
      tanggal: new Date(form.tanggal).toISOString(),
      penulis: form.penulis.trim(),
      is_eksternal: form.isEksternal,
      nama_sumber: form.namaSumber.trim(),
      link_asli: form.linkAsli.trim(),
    };

    const { error } = editingId
      ? await adminService.update('berita', editingId, payload)
      : await adminService.create('berita', payload);

    setSaving(false);

    if (error) {
      console.error('Error simpan berita:', error);
      setFormError('Gagal menyimpan data. Coba lagi.');
      return;
    }

    handleCloseModal();
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('berita', deleteId);
    setDeleteId(null);
    loadData();
  };

  const filtered = list.filter((b) =>
    b.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Berita</h1>
          <p className="text-slate-500">Kelola berita dan pengumuman kelurahan</p>
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
          <p className="p-6 text-center text-slate-500">Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-center text-slate-500">Belum ada berita.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Judul</th>
                  <th className="text-left font-medium px-4 py-3">Kategori</th>
                  <th className="text-left font-medium px-4 py-3">Tanggal</th>
                  <th className="text-right font-medium px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isEksternal = item.is_eksternal ?? item.isEksternal;
                  const namaSumber = item.nama_sumber ?? item.namaSumber;

                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-medium text-slate-900 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{item.judul}</span>
                          {isEksternal && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 shrink-0">
                              <Globe className="w-3 h-3" />
                              {namaSumber || 'Eksternal'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-secondary-100 text-secondary-700">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(item.tanggal)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tambah/Edit */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            {editingId ? 'Edit Berita' : 'Tambah Berita'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Judul
              </label>
              <input
                type="text"
                name="judul"
                value={form.judul}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kategori
                </label>
                <select
                  name="kategori"
                  value={form.kategori}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Umum">Umum</option>
                  <option value="Pengumuman">Pengumuman</option>
                  <option value="Kegiatan">Kegiatan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tanggal Publish
                </label>
                <input
                  type="datetime-local"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Checkbox & Options Berita Eksternal */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isEksternal"
                  checked={form.isEksternal}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
                />
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-amber-500" />
                  Berita dari Sumber Eksternal / Media Luar
                </span>
              </label>

              {form.isEksternal && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Nama Media / Sumber
                    </label>
                    <input
                      type="text"
                      name="namaSumber"
                      placeholder="Contoh: DetikSulsel, Tribun Maros"
                      value={form.namaSumber}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Link / URL Artikel Asli
                    </label>
                    <input
                      type="url"
                      name="linkAsli"
                      placeholder="https://..."
                      value={form.linkAsli}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Ringkasan
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleInputChange}
                rows={2}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Konten
              </label>
              <textarea
                name="konten"
                value={form.konten}
                onChange={handleInputChange}
                rows={6}
                className="input-field resize-none"
              />
            </div>

            <ImageUpload
              label="Gambar"
              value={form.gambar}
              onChange={(url) => setForm((prev) => ({ ...prev, gambar: url }))}
              folder="berita"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Penulis
              </label>
              <input
                type="text"
                name="penulis"
                value={form.penulis}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                {formError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={handleCloseModal} className="btn-outline flex-1">
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex-1 disabled:opacity-60"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)}>
        <div className="p-6 md:p-8 text-center">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Hapus berita ini?
          </h2>
          <p className="text-slate-500 mb-6">Tindakan ini tidak bisa dibatalkan.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="btn-outline flex-1"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              className="btn-primary flex-1 !bg-red-600 hover:!bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BeritaAdmin;