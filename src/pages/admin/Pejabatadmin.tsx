import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/admin/Imageupload';
import { adminService } from '../../services/Adminservice';
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
    setList(data);
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
    setForm({ nama: item.nama, jabatan: item.jabatan, nip: item.nip ?? '', foto: item.foto ?? '', urutan: (item as any).urutan ?? 0 });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama.trim() || !form.jabatan.trim()) {
      setFormError('Nama dan jabatan wajib diisi.');
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
    if (error) { setFormError('Gagal menyimpan data.'); return; }

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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pejabat / Struktur Organisasi</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola daftar pejabat kelurahan</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Tambah Pejabat</button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-slate-500 dark:text-slate-400">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="p-6 text-center text-slate-500 dark:text-slate-400">Belum ada data pejabat.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <img
                  src={item.foto || 'https://placehold.co/80x80?text=Foto'}
                  alt={item.nama}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{item.nama}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.jabatan}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-950/50 dark:hover:text-primary-400 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">{editingId ? 'Edit Pejabat' : 'Tambah Pejabat'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama</label>
              <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Jabatan</label>
              <input type="text" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">NIP</label>
              <input type="text" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} className="input-field" />
            </div>
            <ImageUpload label="Foto" value={form.foto} onChange={(url) => setForm({ ...form, foto: url })} folder="pejabat" />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Urutan Tampil</label>
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
                className="input-field"
              />
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus data pejabat ini?</h2>
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

export default PejabatAdmin;