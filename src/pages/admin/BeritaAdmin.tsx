import { useState, useEffect } from 'react';
import { 
  Save, Globe, FileText, Link as LinkIcon, AlertCircle, User, 
  Plus, Edit2, Trash2, X, Upload, Image as ImageIcon, Loader2 
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; // Adjust path ke supabase client kamu
import type { Berita } from '../../types';

export default function BeritaAdmin() {
  // --- STATE DATA SUPABASE ---
  const [dataBerita, setDataBerita] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- STATE MANAJEMEN MODAL & FORM ---
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<Berita['id'] | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- STATE FORM ---
  const [isEksternal, setIsEksternal] = useState<boolean>(false);
  const [judul, setJudul] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [konten, setKonten] = useState('');
  const [gambar, setGambar] = useState('');
  const [kategori, setKategori] = useState('Kegiatan');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [penulis, setPenulis] = useState('Admin Kelurahan');
  const [namaSumber, setNamaSumber] = useState('');
  const [linkAsli, setLinkAsli] = useState('');

  const [error, setError] = useState<string | null>(null);

  // 1. READ: Fetch Data Berita dari Supabase saat komponen di-mount
  const fetchBerita = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map data dari DB (snake_case) ke objek state React
      const mappedData = (data || []).map((item: any) => ({
        ...item,
        isEksternal: item.is_eksternal,
        namaSumber: item.nama_sumber,
        linkAsli: item.link_asli,
      }));

      setDataBerita(mappedData);
    } catch (err: any) {
      console.error('Gagal mengambil berita:', err.message);
      setError('Gagal memuat data berita dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  // Reset form
  const resetForm = () => {
    setEditingId(undefined);
    setIsEksternal(false);
    setJudul('');
    setSlug('');
    setExcerpt('');
    setKonten('');
    setGambar('');
    setKategori('Kegiatan');
    setTanggal(new Date().toISOString().split('T')[0]);
    setPenulis('Admin Kelurahan');
    setNamaSumber('');
    setLinkAsli('');
    setError(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Berita) => {
    setEditingId(item.id);
    setIsEksternal(item.isEksternal ?? false);
    setJudul(item.judul || '');
    setSlug(item.slug || '');
    setExcerpt(item.excerpt || '');
    setKonten(item.konten || '');
    setGambar(item.gambar || '');
    setKategori(item.kategori || 'Kegiatan');
    setTanggal(item.tanggal ? item.tanggal.split('T')[0] : new Date().toISOString().split('T')[0]);
    setPenulis(item.penulis || 'Admin Kelurahan');
    setNamaSumber(item.namaSumber || '');
    setLinkAsli(item.linkAsli || '');
    setError(null);
    setIsModalOpen(true);
  };

  // Convert Uploaded File ke Data Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran gambar terlalu besar (Maksimal 2MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setGambar(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

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

  // 2. CREATE & UPDATE: Submit Payload ke Supabase (Sudah disesuaikan ke snake_case)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!judul.trim()) {
      setError('Judul berita wajib diisi.');
      return;
    }

    if (isEksternal) {
      if (!linkAsli.trim()) {
        setError('Link sumber asli wajib diisi untuk berita eksternal.');
        return;
      }
    } else {
      if (!slug.trim()) {
        setError('Slug wajib diisi untuk berita internal.');
        return;
      }
    }

    // Payload disesuaikan persis dengan DDL tabel Supabase
    const payload = {
      judul,
      excerpt: excerpt || judul,
      gambar,
      kategori,
      tanggal: new Date(tanggal).toISOString(),
      is_eksternal: isEksternal,
      ...(isEksternal
        ? {
            nama_sumber: namaSumber || 'Sumber Luar',
            link_asli: linkAsli,
            slug: null,
            konten: '',
            penulis: null,
          }
        : {
            slug,
            konten: konten || '',
            penulis: penulis || 'Admin Kelurahan',
            nama_sumber: null,
            link_asli: null,
          }),
    };

    try {
      setIsSubmitting(true);

      if (editingId) {
        // Update data eksis
        const { error: updateError } = await supabase
          .from('berita')
          .update(payload)
          .eq('id', editingId);

        if (updateError) throw updateError;
      } else {
        // Insert data baru
        const { error: insertError } = await supabase
          .from('berita')
          .insert([payload]);

        if (insertError) throw insertError;
      }

      // Refresh list berita & tutup modal
      await fetchBerita();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Error saat menyimpan:', err.message);
      setError(err.message || 'Gagal menyimpan berita ke database Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. DELETE: Hapus Data dari Supabase
  const handleDelete = async (id: string | number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('berita')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Refresh data
      fetchBerita();
    } catch (err: any) {
      console.error('Gagal menghapus:', err.message);
      alert('Gagal menghapus berita: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Kelola Berita & Informasi</h1>
          <p className="text-xs text-slate-500 mt-1">
            Tambah, ubah, atau hapus artikel berita internal dan publikasi luar.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berita</span>
        </button>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Cover</th>
                <th className="p-4">Judul & Tipe</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-700" />
                    <span>Memuat data berita...</span>
                  </td>
                </tr>
              ) : dataBerita.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada data berita yang tersimpan di Supabase.
                  </td>
                </tr>
              ) : (
                dataBerita.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 w-20">
                      {item.gambar ? (
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 line-clamp-1">{item.judul}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {item.isEksternal ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
                            <Globe className="w-3 h-3" /> {item.namaSumber || 'Eksternal'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-semibold">
                            <FileText className="w-3 h-3" /> Internal
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Berita"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => item.id && handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Berita"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Berita' : 'Tambah Berita Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="p-6 overflow-y-auto space-y-5">
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 pl-2">Tipe Publikasi:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleMode(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isEksternal ? 'bg-white text-blue-700 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    <span>Internal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleMode(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isEksternal ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>Eksternal</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {isEksternal && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Nama Sumber Media</label>
                      <input
                        type="text"
                        value={namaSumber}
                        onChange={(e) => setNamaSumber(e.target.value)}
                        placeholder="Contoh: Antara News / Pemkab"
                        className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Link Sumber Asli *</label>
                      <div className="relative">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={linkAsli}
                          onChange={(e) => setLinkAsli(e.target.value)}
                          placeholder="https://situs-berita.com/artikel"
                          className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </>
                )}

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

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tanggal Publikasi</label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
                  />
                </div>

                {!isEksternal && (
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nama Penulis / Editor</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={penulis}
                        onChange={(e) => setPenulis(e.target.value)}
                        placeholder="Contoh: Admin Kelurahan"
                        className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Gambar Cover / Banner</label>
                  <div className="flex items-start gap-4">
                    {gambar && (
                      <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                        <img src={gambar} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setGambar('')}
                          className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <label className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                      <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-600 block">
                        Klik untuk Upload Gambar
                      </span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WEBP hingga 2MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

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

                {!isEksternal && (
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Konten Berita Lengkap *</label>
                    <textarea
                      rows={5}
                      value={konten}
                      onChange={(e) => setKonten(e.target.value)}
                      placeholder="Tuliskan isi berita selengkapnya..."
                      className="w-full p-3 text-xs md:text-sm border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Berita'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}