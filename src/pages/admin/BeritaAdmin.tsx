import { useState } from 'react';
import { Save, Globe, FileText, Link as LinkIcon, AlertCircle, User } from 'lucide-react';
import type { Berita } from '../../types';

interface BeritaAdminProps {
  initialData?: Partial<Berita>;
  onSave?: (data: Partial<Berita>) => void;
}

export default function BeritaAdmin({ initialData, onSave }: BeritaAdminProps) {
  // State Form
  const [isEksternal, setIsEksternal] = useState<boolean>(initialData?.isEksternal ?? false);
  const [judul, setJudul] = useState(initialData?.judul ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [konten, setKonten] = useState(initialData?.konten ?? '');
  const [gambar, setGambar] = useState(initialData?.gambar ?? '');
  const [kategori, setKategori] = useState(initialData?.kategori ?? 'Kegiatan');
  const [tanggal, setTanggal] = useState(initialData?.tanggal ?? new Date().toISOString().split('T')[0]);
  const [penulis, setPenulis] = useState(initialData?.penulis ?? 'Admin Kelurahan');
  
  // Field Khusus Berita Eksternal
  const [namaSumber, setNamaSumber] = useState(initialData?.namaSumber ?? '');
  const [linkAsli, setLinkAsli] = useState(initialData?.linkAsli ?? '');

  const [error, setError] = useState<string | null>(null);

  // Switcher Handler Toggle Mode
  const handleToggleMode = (eksternal: boolean) => {
    setIsEksternal(eksternal);
    setError(null);
    if (eksternal) {
      setSlug('');
      setKonten('');
    }
  };

  const handleJudulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJudul(val);
    if (!isEksternal) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validasi Judul Utama
    if (!judul.trim()) {
      setError('Judul berita wajib diisi.');
      return;
    }

    // 2. Validasi Kondisional
    if (isEksternal) {
      if (!linkAsli.trim()) {
        setError('Link sumber asli (URL Direct) wajib diisi untuk berita eksternal.');
        return;
      }
    } else {
      if (!slug.trim()) {
        setError('Slug wajib diisi untuk berita internal.');
        return;
      }
      if (!konten.trim()) {
        setError('Konten berita lengkap wajib diisi untuk berita internal.');
        return;
      }
    }

    // 3. Susun Payload
    const payload: Partial<Berita> = {
      ...initialData,
      judul,
      excerpt: excerpt || judul,
      gambar,
      kategori,
      tanggal,
      isEksternal,
      ...(isEksternal
        ? {
            namaSumber: namaSumber || 'Sumber Luar',
            linkAsli,
            slug: undefined,
            konten: undefined,
            penulis: undefined,
          }
        : {
            slug,
            konten,
            penulis: penulis || 'Admin Kelurahan',
            namaSumber: undefined,
            linkAsli: undefined,
          }),
    };

    // Safe execution
    if (onSave) {
      onSave(payload);
    } else {
      console.log('Data Berita Disimpan:', payload);
      alert('Berita berhasil disimpan!');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      noValidate
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          {initialData?.id ? 'Edit Berita' : 'Tambah Berita Baru'}
        </h2>

        {/* Toggle Tipe Berita */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleToggleMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isEksternal ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Berita Internal</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggleMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isEksternal ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Sumber Eksternal</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Utama Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Judul Berita */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-700">Judul Berita *</label>
          <input
            type="text"
            value={judul}
            onChange={handleJudulChange}
            placeholder="Masukkan judul artikel/berita"
            className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
          />
        </div>

        {/* SLUG: Hanya Tampil Saat Berita Internal */}
        {!isEksternal && (
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">URL Slug (Otomatis) *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="judul-artikel-berita"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:border-blue-700 focus:outline-hidden"
            />
          </div>
        )}

        {/* BERITA EKSTERNAL */}
        {isEksternal && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Sumber Media</label>
              <input
                type="text"
                value={namaSumber}
                onChange={(e) => setNamaSumber(e.target.value)}
                placeholder="Contoh: MarosKab.go.id / Antara News"
                className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Link Sumber Asli (URL Direct) *</label>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={linkAsli}
                  onChange={(e) => setLinkAsli(e.target.value)}
                  placeholder="https://situs-berita.com/artikel-asli"
                  className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
                />
              </div>
            </div>
          </>
        )}

        {/* Kategori */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden bg-white"
          >
            <option value="Kegiatan">Kegiatan</option>
            <option value="Pengumuman">Pengumuman</option>
            <option value="Edukasi">Edukasi</option>
            <option value="Pembangunan">Pembangunan</option>
          </select>
        </div>

        {/* Tanggal Publikasi */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Tanggal Publikasi</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
          />
        </div>

        {/* Penulis (Berita Internal) */}
        {!isEksternal && (
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Penulis / Editor</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={penulis}
                onChange={(e) => setPenulis(e.target.value)}
                placeholder="Contoh: Admin Kelurahan / Seklur"
                className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* URL Gambar Banner */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-700">URL Gambar Banner</label>
          <input
            type="url"
            value={gambar}
            onChange={(e) => setGambar(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
          />
        </div>

        {/* Excerpt */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-700">Ringkasan Singkat (Excerpt)</label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan singkat berita..."
            className="w-full p-3 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
          />
        </div>

        {/* Konten Lengkap (Berita Internal) */}
        {!isEksternal && (
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Konten Berita Lengkap *</label>
            <textarea
              rows={6}
              value={konten}
              onChange={(e) => setKonten(e.target.value)}
              placeholder="Tuliskan isi berita selengkapnya di sini..."
              className="w-full p-3 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Berita</span>
        </button>
      </div>
    </form>
  );
}