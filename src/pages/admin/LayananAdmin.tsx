import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Pencil, Trash2, Clock, Banknote, ListChecks, 
  FileText, Loader2, AlertCircle, AlertTriangle 
} from 'lucide-react';
import Modal from '../../components/Modal';
import IconPicker from '../../components/admin/Iconpicker';
import ArrayInput from '../../components/admin/Arrayinput';
import { adminService } from '../../services/adminService';
import { getIcon } from '../../lib/icons';
import type { Layanan } from '../../types';

const emptyForm = { nama: '', deskripsi: '', icon: 'FileText', durasi: '', biaya: 'Gratis', syarat: [''] };

function LayananAdmin() {
  const [list, setList] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<Layanan>('layanan_publik', 'created_at', true);
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

  const openEdit = (item: Layanan) => {
    setEditingId(item.id);
    setForm({
      nama: item.nama, 
      deskripsi: item.deskripsi ?? '', 
      icon: item.icon || 'FileText',
      durasi: item.durasi ?? '', 
      biaya: item.biaya ?? 'Gratis', 
      syarat: item.syarat?.length ? item.syarat : [''],
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama.trim()) { setFormError('Nama layanan wajib diisi.'); return; }
    setSaving(true);
    setFormError('');
    const payload = { ...form, syarat: form.syarat.filter((s) => s.trim() !== '') };
    const { error } = editingId
      ? await adminService.update('layanan_publik', editingId, payload)
      : await adminService.create('layanan_publik', payload);
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan layanan.'); return; }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('layanan_publik', deleteId);
    setDeleteId(null);
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Layanan Publik</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              {list.length} Layanan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola syarat dan Prosedur Operasional Standar (SOP) pengurusan dokumen kelurahan.
          </p>
        </div>
        <button 
          onClick={openCreate} 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* GRID CARDS LAYANAN */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-700" />
          <p className="text-xs font-medium text-slate-500">Memuat daftar layanan...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Belum Ada Layanan</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Daftar persyaratan layanan publik masih kosong. Tambahkan layanan baru sekarang.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item) => {
            const IconComponent = getIcon(item.icon);
            return (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => openEdit(item)} 
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit Layanan"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setDeleteId(item.id)} 
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Layanan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {item.nama}
                    </h3>
                    {item.deskripsi && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {item.deskripsi}
                      </p>
                    )}
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.durasi || 'Sesuai Prosedur'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                      <Banknote className="w-3 h-3 text-emerald-600" />
                      {item.biaya || 'Gratis'}
                    </span>
                  </div>

                  {/* Syarat List Preview */}
                  {item.syarat && item.syarat.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <ListChecks className="w-3 h-3" /> Syarat Berkas ({item.syarat.length})
                      </p>
                      <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                        {item.syarat.slice(0, 2).map((s, idx) => (
                          <li key={idx} className="truncate">{s}</li>
                        ))}
                        {item.syarat.length > 2 && (
                          <li className="text-[10px] text-slate-400 list-none pt-0.5">
                            +{item.syarat.length - 2} syarat lainnya
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
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
              {editingId ? 'Edit Layanan Publik' : 'Tambah Layanan Baru'}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nama Layanan *</label>
              <input 
                type="text" 
                value={form.nama} 
                onChange={(e) => setForm({ ...form, nama: e.target.value })} 
                placeholder="Contoh: Surat Keterangan Domisili"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Deskripsi Singkat</label>
              <textarea 
                value={form.deskripsi} 
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} 
                rows={2} 
                placeholder="Penjelasan kegunaan dokumen ini..."
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden resize-none" 
              />
            </div>

            <IconPicker 
              label="Ikon Layanan *" 
              value={form.icon} 
              onChange={(icon) => setForm({ ...form, icon })} 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Estimasi Waktu</label>
                <input 
                  type="text" 
                  value={form.durasi} 
                  onChange={(e) => setForm({ ...form, durasi: e.target.value })} 
                  placeholder="Contoh: 1 Hari Kerja" 
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Biaya Administrasi</label>
                <input 
                  type="text" 
                  value={form.biaya} 
                  onChange={(e) => setForm({ ...form, biaya: e.target.value })} 
                  placeholder="Gratis / Rp 0" 
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
                />
              </div>
            </div>

            <ArrayInput 
              label="Persyaratan Berkas" 
              values={form.syarat} 
              onChange={(syarat) => setForm({ ...form, syarat })} 
              placeholder="Contoh: Fotokopi KTP & KK" 
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
                <span>{saving ? 'Menyimpan...' : 'Simpan Layanan'}</span>
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
            <h2 className="text-base font-bold text-slate-900">Hapus Layanan Ini?</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Layanan akan terhapus dari daftar petunjuk masyarakat di portal publik.
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

export default LayananAdmin;