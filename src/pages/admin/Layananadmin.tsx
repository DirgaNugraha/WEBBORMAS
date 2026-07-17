import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import IconPicker from '../../components/admin/Iconpicker';
import ArrayInput from '../../components/admin/Arrayinput';
import { adminService } from '../../services/Adminservice';
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

  const openEdit = (item: Layanan) => {
    setEditingId(item.id);
    setForm({
      nama: item.nama, deskripsi: item.deskripsi ?? '', icon: item.icon,
      durasi: item.durasi ?? '', biaya: item.biaya ?? 'Gratis', syarat: item.syarat?.length ? item.syarat : [''],
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
    if (error) { setFormError('Gagal menyimpan data.'); return; }
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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Layanan Publik</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola daftar layanan administrasi kelurahan</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Tambah Layanan</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-6">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-6">Belum ada layanan.</p>
        ) : (
          list.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.id} className="card p-5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mb-3">
                  <Icon className="w-5.5 h-5.5 text-white" />
                </div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{item.nama}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{item.durasi} • {item.biaya}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                  <button onClick={() => setDeleteId(item.id)} className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">{editingId ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Layanan</label>
              <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi</label>
              <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={2} className="input-field resize-none" />
            </div>
            <IconPicker label="Ikon" value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Durasi</label>
                <input type="text" value={form.durasi} onChange={(e) => setForm({ ...form, durasi: e.target.value })} placeholder="1 hari kerja" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Biaya</label>
                <input type="text" value={form.biaya} onChange={(e) => setForm({ ...form, biaya: e.target.value })} className="input-field" />
              </div>
            </div>
            <ArrayInput label="Syarat" values={form.syarat} onChange={(syarat) => setForm({ ...form, syarat })} placeholder="contoh: Fotokopi KTP" />
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus layanan ini?</h2>
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

export default LayananAdmin;