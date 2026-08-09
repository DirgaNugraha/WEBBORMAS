import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Pencil, Trash2, Calendar, MapPin, Clock, Tag, 
  CheckCircle2, AlertCircle, Loader2, CalendarDays, AlertTriangle 
} from 'lucide-react';
import Modal from '../../components/Modal';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../lib/format';
import type { Agenda } from '../../types';

const emptyForm = {
  judul: '', 
  deskripsi: '', 
  tanggal: new Date().toISOString().slice(0, 16),
  waktu: '', 
  lokasi: '', 
  kategori: 'Umum', 
  status: 'upcoming' as 'upcoming' | 'selesai',
};

function AgendaAdmin() {
  const [list, setList] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await adminService.list<Agenda>('agenda', 'tanggal', true);
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

  const openEdit = (item: Agenda) => {
    setEditingId(item.id);
    setForm({
      judul: item.judul, 
      deskripsi: item.deskripsi ?? '', 
      tanggal: item.tanggal ? item.tanggal.slice(0, 16) : new Date().toISOString().slice(0, 16),
      waktu: item.waktu ?? '', 
      lokasi: item.lokasi ?? '', 
      kategori: item.kategori || 'Umum', 
      status: (item.status as 'upcoming' | 'selesai') || 'upcoming',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.judul.trim()) { setFormError('Judul agenda wajib diisi.'); return; }
    setSaving(true);
    setFormError('');
    
    const payload = { ...form, tanggal: new Date(form.tanggal).toISOString() };
    const { error } = editingId
      ? await adminService.update('agenda', editingId, payload)
      : await adminService.create('agenda', payload);
      
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan data ke server.'); return; }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminService.remove('agenda', deleteId);
    setDeleteId(null);
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Agenda Kegiatan</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              {list.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola jadwal, lokasi, dan informasi kegiatan di lingkungan kelurahan.
          </p>
        </div>
        <button 
          onClick={openCreate} 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda</span>
        </button>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-700" />
            <p className="text-xs font-medium text-slate-500">Memuat data agenda...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <CalendarDays className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Belum Ada Agenda</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Silakan klik tombol "Tambah Agenda" di atas untuk membuat jadwal kegiatan baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Agenda & Detail</th>
                  <th className="p-4">Waktu & Lokasi</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((item) => {
                  const isUpcoming = item.status === 'upcoming';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Judul & Deskripsi */}
                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">
                          {item.judul}
                        </div>
                        {item.deskripsi && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.deskripsi}
                          </p>
                        )}
                      </td>

                      {/* Tanggal, Jam & Lokasi */}
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{formatDate(item.tanggal)}</span>
                        </div>
                        {item.waktu && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{item.waktu}</span>
                          </div>
                        )}
                        {item.lokasi && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{item.lokasi}</span>
                          </div>
                        )}
                      </td>

                      {/* Kategori */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200/60">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {item.kategori || 'Umum'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          isUpcoming 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                            : 'bg-slate-100 text-slate-600 border-slate-200/60'
                        }`}>
                          {isUpcoming ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Akan Datang
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-slate-400" />
                              Selesai
                            </>
                          )}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => openEdit(item)} 
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Agenda"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteId(item.id)} 
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Agenda"
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

      {/* MODAL FORM CREATE / EDIT */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              {editingId ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Baru'}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Input Judul */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Judul Agenda *</label>
              <input 
                type="text" 
                value={form.judul} 
                onChange={(e) => setForm({ ...form, judul: e.target.value })} 
                placeholder="Masukkan nama agenda/kegiatan"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>

            {/* Input Deskripsi */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Deskripsi Singkat</label>
              <textarea 
                value={form.deskripsi} 
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} 
                rows={2} 
                placeholder="Penjelasan ringkas mengenai agenda..."
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden resize-none" 
              />
            </div>

            {/* Grid Tanggal & Waktu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tanggal & Waktu Utama *</label>
                <input 
                  type="datetime-local" 
                  value={form.tanggal} 
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })} 
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden bg-white" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Keterangan Jam (Teks)</label>
                <input 
                  type="text" 
                  value={form.waktu} 
                  onChange={(e) => setForm({ ...form, waktu: e.target.value })} 
                  placeholder="Contoh: 09:00 - 12:00 WITA" 
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
                />
              </div>
            </div>

            {/* Input Lokasi */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Lokasi Pelaksanaan</label>
              <input 
                type="text" 
                value={form.lokasi} 
                onChange={(e) => setForm({ ...form, lokasi: e.target.value })} 
                placeholder="Contoh: Aula Kantor Kelurahan"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>

            {/* Grid Kategori & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Kategori</label>
                <input 
                  type="text" 
                  value={form.kategori} 
                  onChange={(e) => setForm({ ...form, kategori: e.target.value })} 
                  placeholder="Umum / Kemasyarakatan / Rapat"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Status Agenda</label>
                <select 
                  value={form.status} 
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })} 
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden bg-white"
                >
                  <option value="upcoming">Akan Datang</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>

            {/* Form Error Alert */}
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Action Buttons */}
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
                <span>{saving ? 'Menyimpan...' : 'Simpan Agenda'}</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL KONFIRMASI HAPUS */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)}>
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Hapus Agenda Ini?</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Tindakan ini tidak dapat dibatalkan. Agenda akan terhapus secara permanen dari sistem.
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

export default AgendaAdmin;