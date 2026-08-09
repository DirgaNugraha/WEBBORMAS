import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Pencil, Trash2, BarChart2, Loader2, 
  AlertCircle, AlertTriangle 
} from 'lucide-react';
import Modal from '../../components/Modal';
import IconPicker from '../../components/admin/Iconpicker';
import { adminService } from '../../services/Adminservice';
import { getIcon } from '../../lib/icons';
import type { StatItem } from '../../types';

const colorOptions = ['primary', 'secondary', 'accent'];
const emptyForm = { label: '', value: '', icon: 'Users', color: 'primary', urutan: 0 as number | '' };

function StatistikAdmin() {
  const [list, setList] = useState<(StatItem & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<StatItem & { id: string }>('statistik_beranda', 'urutan', true);
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

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ label: item.label, value: item.value, icon: item.icon, color: item.color, urutan: item.urutan ?? 0 });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.label.trim() || !form.value.trim()) {
      setFormError('Label dan nilai statistik wajib diisi.');
      return;
    }
    setSaving(true);
    setFormError('');

    const payload = {
      ...form,
      urutan: form.urutan === '' ? 0 : Number(form.urutan),
    };

    const { error } = editingId
      ? await adminService.update('statistik_beranda', editingId, payload)
      : await adminService.create('statistik_beranda', payload);
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan statistik.'); return; }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('statistik_beranda', deleteId);
    setDeleteId(null);
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Statistik Beranda</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {list.length} Kartu
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            4 atau lebih kartu ringkasan angka statistik penting di halaman beranda.
          </p>
        </div>
        <button 
          onClick={openCreate} 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Statistik</span>
        </button>
      </div>

      {/* GRID CONTAINER */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-700" />
          <p className="text-xs font-medium text-slate-500">Memuat data statistik...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <BarChart2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Belum Ada Statistik</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Silakan tambahkan data angka capaian umum seperti Jumlah Penduduk, Luas Wilayah, RT/RW, dll.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((item) => {
            const IconComponent = getIcon(item.icon);
            return (
              <div 
                key={item.id} 
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{item.urutan}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {item.value}
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      {item.label}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-1">
                  <button 
                    onClick={() => openEdit(item)} 
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit Statistik"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setDeleteId(item.id)} 
                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Statistik"
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
              {editingId ? 'Edit Kartu Statistik' : 'Tambah Kartu Statistik'}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Label Keterangan *</label>
              <input 
                type="text" 
                value={form.label} 
                onChange={(e) => setForm({ ...form, label: e.target.value })} 
                placeholder="Contoh: Jumlah Penduduk / Wilayah RT" 
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nilai / Angka Tampil *</label>
              <input 
                type="text" 
                value={form.value} 
                onChange={(e) => setForm({ ...form, value: e.target.value })} 
                placeholder="Contoh: 4.520 Jiwa / 12,5 km²" 
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>

            <IconPicker 
              label="Ikon *" 
              value={form.icon} 
              onChange={(icon) => setForm({ ...form, icon })} 
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Skema Warna</label>
                <select 
                  value={form.color} 
                  onChange={(e) => setForm({ ...form, color: e.target.value })} 
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden capitalize"
                >
                  {colorOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Urutan Tampil</label>
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
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
                />
              </div>
            </div>

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
                <span>{saving ? 'Menyimpan...' : 'Simpan Statistik'}</span>
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
            <h2 className="text-base font-bold text-slate-900">Hapus Statistik Ini?</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Data statistik ini akan dihapus dari kartu ringkasan beranda.
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

export default StatistikAdmin;