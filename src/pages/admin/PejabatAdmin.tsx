import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Pencil, Trash2, Users, CreditCard, Hash, 
  Loader2, AlertCircle, AlertTriangle 
} from 'lucide-react';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/admin/Imageupload';
import { adminService } from '../../services/adminService';
import type { Pejabat } from '../../types';

const emptyForm = { nama: '', jabatan: '', nip: '', foto: '', urutan: 0 as number | '' };

function PejabatAdmin() {
  const [list, setList] = useState<Pejabat[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<Pejabat>('pejabat_kelurahan', 'urutan', true);
    setList(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, urutan: list.length + 1 });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item: Pejabat) => {
    setEditingId(item.id);
    setForm({ 
      nama: item.nama, 
      jabatan: item.jabatan, 
      nip: item.nip ?? '', 
      foto: item.foto ?? '', 
      urutan: (item as any).urutan ?? 0 
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama.trim() || !form.jabatan.trim()) {
      setFormError('Nama lengkap dan posisi jabatan wajib diisi.');
      return;
    }
    setSaving(true);
    setFormError('');

    const payload = {
      ...form,
      urutan: form.urutan === '' ? 0 : Number(form.urutan),
    };

    const { error } = editingId
      ? await adminService.update('pejabat_kelurahan', editingId, payload)
      : await adminService.create('pejabat_kelurahan', payload);

    setSaving(false);
    if (error) { setFormError('Gagal menyimpan data pejabat.'); return; }

    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('pejabat_kelurahan', deleteId);
    setDeleteId(null);
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Struktur Organisasi & Pejabat</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              {list.length} Orang
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola urutan dan daftar aparatur pemerintah kelurahan.
          </p>
        </div>
        <button 
          onClick={openCreate} 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pejabat</span>
        </button>
      </div>

      {/* CONTAINER PEJABAT */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-700" />
            <p className="text-xs font-medium text-slate-500">Memuat data aparatur...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Belum Ada Data Pejabat</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Silakan tambahkan struktur organisasi dan pejabat kelurahan.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {list.map((item) => (
              <div 
                key={item.id} 
                className="p-4 sm:p-5 flex items-center gap-4 hover:bg-slate-50/80 transition-colors"
              >
                {/* Profile Photo */}
                <img
                  src={item.foto || 'https://placehold.co/100x100?text=Foto'}
                  alt={item.nama}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                />

                {/* Profile Information */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {item.nama}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      <Hash className="w-2.5 h-2.5 text-slate-400" />
                      Urutan: {(item as any).urutan ?? 0}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-blue-700">
                    {item.jabatan}
                  </p>

                  {item.nip && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-slate-300" />
                      NIP: {item.nip}
                    </p>
                  )}
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => openEdit(item)} 
                    className="p-2 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit Pejabat"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteId(item.id)} 
                    className="p-2 rounded-xl text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Pejabat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              {editingId ? 'Edit Data Pejabat' : 'Tambah Pejabat Baru'}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nama Lengkap & Gelar *</label>
              <input 
                type="text" 
                value={form.nama} 
                onChange={(e) => setForm({ ...form, nama: e.target.value })} 
                placeholder="Contoh: Ahmad Subagyo, S.STP."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Jabatan / Posisi *</label>
              <input 
                type="text" 
                value={form.jabatan} 
                onChange={(e) => setForm({ ...form, jabatan: e.target.value })} 
                placeholder="Contoh: Lurah Borimasunggu"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">NIP (Opsional)</label>
                <input 
                  type="text" 
                  value={form.nip} 
                  onChange={(e) => setForm({ ...form, nip: e.target.value })} 
                  placeholder="19850101 201001 1 001"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Urutan Tampil *</label>
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
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden bg-white"
                />
              </div>
            </div>

            <ImageUpload 
              label="Foto Profil *" 
              value={form.foto} 
              onChange={(url) => setForm({ ...form, foto: url })} 
              folder="pejabat" 
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
                <span>{saving ? 'Menyimpan...' : 'Simpan Data'}</span>
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
            <h2 className="text-base font-bold text-slate-900">Hapus Data Pejabat Ini?</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Aparatur ini akan dihapus dari daftar struktur organisasi kelurahan.
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

export default PejabatAdmin;