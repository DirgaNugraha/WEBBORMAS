import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Pencil, Trash2, Loader2, 
  AlertCircle, AlertTriangle, Layers 
} from 'lucide-react';
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

  const openEdit = (item: Potensi) => {
    setEditingId(item.id);
    setForm({ 
      nama: item.nama, 
      kategori: item.kategori, 
      deskripsi: item.deskripsi ?? '', 
      gambar: item.gambar ?? '', 
      icon: item.icon || 'Sprout' 
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama.trim() || !form.kategori.trim()) { 
      setFormError('Nama potensi dan kategori wajib diisi.'); 
      return; 
    }
    setSaving(true);
    setFormError('');
    const { error } = editingId
      ? await adminService.update('potensi_kelurahan', editingId, form)
      : await adminService.create('potensi_kelurahan', form);
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan data potensi.'); return; }
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Potensi Kelurahan</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {list.length} Potensi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola potensi unggulan daerah (pertanian, perikanan, UMKM, wisata, dsb).
          </p>
        </div>
        <button 
          onClick={openCreate} 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Potensi</span>
        </button>
      </div>

      {/* GRID CONTAINER */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-700" />
          <p className="text-xs font-medium text-slate-500">Memuat daftar potensi...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Belum Ada Data Potensi</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Silakan tambahkan sektor komoditas unggulan atau potensi ekonomi warga kelurahan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item) => {
            const IconComponent = getIcon(item.icon);
            return (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image or Icon Banner */}
                  {item.gambar ? (
                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                      <img 
                        src={item.gambar} 
                        alt={item.nama} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                          <IconComponent className="w-3 h-3 text-emerald-400" />
                          {item.kategori}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-slate-100 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-emerald-700 shadow-2xs border border-emerald-100">
                        <IconComponent className="w-3.5 h-3.5 text-emerald-600" />
                        {item.kategori}
                      </span>
                    </div>
                  )}

                  <div className="p-4 space-y-1.5">
                    <h3 className="font-bold text-sm text-slate-900">
                      {item.nama}
                    </h3>
                    {item.deskripsi && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.deskripsi}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-1">
                  <button 
                    onClick={() => openEdit(item)} 
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit Potensi"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setDeleteId(item.id)} 
                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Potensi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL FORM */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              {editingId ? 'Edit Potensi Kelurahan' : 'Tambah Potensi Baru'}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nama Potensi *</label>
              <input 
                type="text" 
                value={form.nama} 
                onChange={(e) => setForm({ ...form, nama: e.target.value })} 
                placeholder="Contoh: Budi Daya Rumput Laut"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Kategori *</label>
              <input 
                type="text" 
                value={form.kategori} 
                onChange={(e) => setForm({ ...form, kategori: e.target.value })} 
                placeholder="Contoh: Perikanan / Pertanian / UMKM / Wisata" 
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Deskripsi Singkat</label>
              <textarea 
                value={form.deskripsi} 
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} 
                rows={3} 
                placeholder="Penjelasan ringkas mengenai komoditas atau potensi ini..."
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden resize-none" 
              />
            </div>

            <ImageUpload 
              label="Foto Pendukung (Opsional)" 
              value={form.gambar} 
              onChange={(url) => setForm({ ...form, gambar: url })} 
              folder="potensi" 
            />

            <IconPicker 
              label="Ikon *" 
              value={form.icon} 
              onChange={(icon) => setForm({ ...form, icon })} 
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
                <span>{saving ? 'Menyimpan...' : 'Simpan Potensi'}</span>
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
            <h2 className="text-base font-bold text-slate-900">Hapus Potensi Ini?</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Data potensi ini tidak akan ditunjukkan lagi pada beranda publik kelurahan.
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

export default PotensiAdmin;