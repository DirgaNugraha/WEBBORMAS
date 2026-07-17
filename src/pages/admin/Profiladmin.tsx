import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import ArrayInput from '../../components/admin/Arrayinput';
import { supabase } from '../../lib/supabaseClient';

interface ProfilForm {
  id: string;
  kecamatan: string;
  kabupaten: string;
  alamat: string;
  telepon: string;
  email: string;
  jam_layanan: string;
  jumlah_penduduk: number;
  luas_wilayah: string;
  visi: string;
  misi: string[];
  sejarah: string;
}

function ProfilAdmin() {
  const [form, setForm] = useState<ProfilForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('profil_kelurahan').select('*').limit(1).single();
      if (!error && data) setForm({ ...data, misi: data.misi ?? [] });
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setError('');

    const { id, ...payload } = form;
    const { error } = await supabase.from('profil_kelurahan').update(payload).eq('id', id);

    setSaving(false);

    if (error) {
      setError('Gagal menyimpan perubahan.');
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading || !form) {
    return <p className="p-6 text-slate-500 dark:text-slate-400">Memuat profil...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Profil Kelurahan</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Data ini hanya 1 baris, berlaku untuk seluruh website</p>

      <div className="card p-6 space-y-4 max-w-3xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kecamatan</label>
            <input type="text" value={form.kecamatan} onChange={(e) => setForm({ ...form, kecamatan: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kabupaten</label>
            <input type="text" value={form.kabupaten} onChange={(e) => setForm({ ...form, kabupaten: e.target.value })} className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Alamat Kantor</label>
          <input type="text" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} className="input-field" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telepon</label>
            <input type="text" value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Jam Layanan</label>
          <input type="text" value={form.jam_layanan} onChange={(e) => setForm({ ...form, jam_layanan: e.target.value })} className="input-field" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Jumlah Penduduk</label>
            <input
              type="number"
              value={form.jumlah_penduduk}
              onChange={(e) => setForm({ ...form, jumlah_penduduk: Number(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Luas Wilayah</label>
            <input
              type="text"
              value={form.luas_wilayah}
              onChange={(e) => setForm({ ...form, luas_wilayah: e.target.value })}
              placeholder="contoh: 12,5 km²"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Visi</label>
          <textarea value={form.visi} onChange={(e) => setForm({ ...form, visi: e.target.value })} rows={2} className="input-field resize-none" />
        </div>

        <ArrayInput
          label="Misi"
          values={form.misi}
          onChange={(misi) => setForm({ ...form, misi })}
          placeholder="Poin misi..."
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sejarah</label>
          <textarea value={form.sejarah} onChange={(e) => setForm({ ...form, sejarah: e.target.value })} rows={4} className="input-field resize-none" />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-sm">{error}</div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" /> Perubahan berhasil disimpan.
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
}

export default ProfilAdmin;