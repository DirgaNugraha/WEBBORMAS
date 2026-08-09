import { useState, useEffect } from 'react';
import { 
  CheckCircle2, Building2, MapPin, Phone, Mail, Clock, 
  Users, Maximize2, Target, History, Loader2, Save 
} from 'lucide-react';
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
      setError('Gagal menyimpan perubahan profil kelurahan.');
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
        <p className="text-xs font-medium text-slate-500">Memuat profil kelurahan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Profil Kelurahan</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengaturan umum data wilayah, Kontak, Visi Misi, dan Sejarah publik kelurahan.
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      {/* FEEDBACK MESSAGES */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">Profil Kelurahan berhasil diperbarui.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 shadow-xs">
          <span className="font-bold">{error}</span>
        </div>
      )}

      {/* FORM BODY */}
      <div className="space-y-6 text-xs">
        {/* WILAYAH & DEMOGRAFI */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-700" />
            <h2 className="font-bold text-slate-900 text-sm">Wilayah & Demografi</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Kecamatan *</label>
              <input 
                type="text" 
                value={form.kecamatan} 
                onChange={(e) => setForm({ ...form, kecamatan: e.target.value })} 
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Kabupaten / Kota *</label>
              <input 
                type="text" 
                value={form.kabupaten} 
                onChange={(e) => setForm({ ...form, kabupaten: e.target.value })} 
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Jumlah Penduduk (Jiwa)
              </label>
              <input
                type="number"
                value={form.jumlah_penduduk}
                onChange={(e) => setForm({ ...form, jumlah_penduduk: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> Luas Wilayah
              </label>
              <input
                type="text"
                value={form.luas_wilayah}
                onChange={(e) => setForm({ ...form, luas_wilayah: e.target.value })}
                placeholder="Contoh: 12,5 km²"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* KONTAK & ALAMAT */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-blue-700" />
            <h2 className="font-bold text-slate-900 text-sm">Kontak Kantor & Layanan</h2>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Alamat Lengkap Kantor *</label>
            <input 
              type="text" 
              value={form.alamat} 
              onChange={(e) => setForm({ ...form, alamat: e.target.value })} 
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Nomor Telepon / WA
              </label>
              <input 
                type="text" 
                value={form.telepon} 
                onChange={(e) => setForm({ ...form, telepon: e.target.value })} 
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Resmi Kelurahan
              </label>
              <input 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Jam Operational Layanan
            </label>
            <input 
              type="text" 
              value={form.jam_layanan} 
              onChange={(e) => setForm({ ...form, jam_layanan: e.target.value })} 
              placeholder="Contoh: Senin - Jumat, 08:00 - 16:00 WITA"
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden" 
            />
          </div>
        </div>

        {/* VISI & MISI */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Target className="w-4 h-4 text-blue-700" />
            <h2 className="font-bold text-slate-900 text-sm">Visi & Misi Kelurahan</h2>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Visi *</label>
            <textarea 
              value={form.visi} 
              onChange={(e) => setForm({ ...form, visi: e.target.value })} 
              rows={2} 
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden resize-none" 
            />
          </div>

          <ArrayInput
            label="Misi Kelurahan"
            values={form.misi}
            onChange={(misi) => setForm({ ...form, misi })}
            placeholder="Poin misi..."
          />
        </div>

        {/* SEJARAH KELURAHAN */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <History className="w-4 h-4 text-blue-700" />
            <h2 className="font-bold text-slate-900 text-sm">Sejarah & Latar Belakang</h2>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Teks Ringkasan Sejarah</label>
            <textarea 
              value={form.sejarah} 
              onChange={(e) => setForm({ ...form, sejarah: e.target.value })} 
              rows={5} 
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden resize-none" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilAdmin;