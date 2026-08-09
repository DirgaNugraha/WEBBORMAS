import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Pencil, Trash2, Images, Calendar, Tag, 
  Loader2, AlertCircle, AlertTriangle 
} from 'lucide-react';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/admin/Imageupload';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../lib/format';
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
    setList(data || []);
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
    setForm({ 
      judul: item.judul, 
      kategori: item.kategori, 
      gambar: item.gambar, 
      tanggal: item.tanggal ? item.tanggal.slice(0, 10) : new Date().toISOString().slice(0, 10) 
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.judul.trim() || !form.gambar) { 
      setFormError('Judul foto dan file gambar wajib diisi.'); 
      return; 
    }
    setSaving(true);
    setFormError('');
    const payload = { ...form, tanggal: new Date(form.tanggal).toISOString() };
    const { error } = editingId
      ? await adminService.update('galeri', editingId, payload)
      : await adminService.create('galeri', payload);
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan foto.'); return; }
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Galeri Foto</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-200/60">
              {list.length} Foto
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola dokumentasi kegiatan dan foto fasilitas umum kelurahan.
          </p>
        </div>
        <button 
          onClick={openCreate} 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto</span>
        </button>
      </div>

      {/* GRID CONTAINER */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-700" />
          <p className="text-xs font-medium text-slate-500">Memuat koleksi foto...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Images className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Belum Ada Foto Galeri</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Dokumentasi belum ditambahkan. Klik tombol "Tambah Foto" di atas untuk menambahkan koleksi baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md overflow-hidden transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  <img 
                    src={item.gambar} 
                    alt={item.judul} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      <Tag className="w-2.5 h-2.5" />
                      {item.kategori}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2">
                    {item.judul}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    <span>{formatDate(item.tanggal)}</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-1">
                <button 
                  onClick={() => openEdit(item)} 
                  className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Edit Foto"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setDeleteId(item.id)} 
                  className="p-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              {editingId ? 'Edit Galeri Foto' : 'Tambah Foto Baru'}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Judul Foto *</label>
              <input 
                type="text" 
                value={form.judul} 
                onChange={(e) => setForm({ ...form, judul: e.target.value })} 
                placeholder="Misal: Penyerahan Bantuan Sosial Kebencanaan"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Kategori *</label>
                <input 
                  type="text" 
                  value={form.kategori} 
                  onChange={(e) => setForm({ ...form, kategori: e.target.value })} 
                  placeholder="Kegiatan / Fasilitas / Umkm" 
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tanggal *</label>
                <input 
                  type="date" 
                  value={form.tanggal} 
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })} 
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden bg-white" 
                />
              </div>
            </div>

            <ImageUpload 
              label="File Gambar *" 
              value={form.gambar} 
              onChange={(url) => setForm({ ...form, gambar: url })} 
              folder="galeri" 
            />

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setModalOpen(false)} 
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleSave} 
                disabled={saving} 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{saving ? 'Menyimpan...' : 'Simpan Foto'}</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL CONFIRM DELETE */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)}>
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Hapus Foto Ini?</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Foto akan dihapus secara permanen dari berkas galeri kelurahan.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => setDeleteId(null)} 
              className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              onClick={handleDelete} 
              className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GaleriAdmin;