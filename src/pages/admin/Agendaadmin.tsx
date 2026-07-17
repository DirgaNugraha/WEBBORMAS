import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import { adminService } from '../../services/Adminservice';
import { formatDate } from '../../lib/format';
import type { Agenda } from '../../types';

const emptyForm = {
  judul: '', deskripsi: '', tanggal: new Date().toISOString().slice(0, 16),
  waktu: '', lokasi: '', kategori: 'Umum', status: 'upcoming' as 'upcoming' | 'selesai',
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

  const openEdit = (item: Agenda) => {
    setEditingId(item.id);
    setForm({
      judul: item.judul, deskripsi: item.deskripsi ?? '', tanggal: item.tanggal.slice(0, 16),
      waktu: item.waktu ?? '', lokasi: item.lokasi ?? '', kategori: item.kategori, status: item.status as any,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.judul.trim()) { setFormError('Judul wajib diisi.'); return; }
    setSaving(true);
    setFormError('');
    const payload = { ...form, tanggal: new Date(form.tanggal).toISOString() };
    const { error } = editingId
      ? await adminService.update('agenda', editingId, payload)
      : await adminService.create('agenda', payload);
    setSaving(false);
    if (error) { setFormError('Gagal menyimpan data.'); return; }
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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agenda</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola jadwal kegiatan kelurahan</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Tambah Agenda</button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-slate-500 dark:text-slate-400">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="p-6 text-center text-slate-500 dark:text-slate-400">Belum ada agenda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Judul</th>
                  <th className="text-left font-medium px-4 py-3">Tanggal</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-right font-medium px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {list.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-xs truncate">{item.judul}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(item.tanggal)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${item.status === 'upcoming' ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {item.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-950/50 dark:hover:text-primary-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(item.id)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">{editingId ? 'Edit Agenda' : 'Tambah Agenda'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Judul</label>
              <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi</label>
              <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={2} className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tanggal</label>
                <input type="datetime-local" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Waktu (teks)</label>
                <input type="text" value={form.waktu} onChange={(e) => setForm({ ...form, waktu: e.target.value })} placeholder="09:00 - 12:00 WITA" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Lokasi</label>
              <input type="text" value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kategori</label>
                <input type="text" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="input-field">
                  <option value="upcoming">Akan Datang</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus agenda ini?</h2>
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

export default AgendaAdmin;