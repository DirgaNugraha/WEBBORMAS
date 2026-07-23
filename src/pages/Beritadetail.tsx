import { memo, useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2, Clock, ExternalLink, Globe } from 'lucide-react';
import { dataService } from '../services/dataService';
import { formatDate } from '../lib/format';
import { createBeritaSlug } from '../lib/slug';
import type { Berita } from '../types';

// Menampilkan jarak waktu relatif, mis. "1 minggu yang lalu"
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Hari ini';
  if (diffDays === 1) return '1 hari yang lalu';
  if (diffDays < 7) return `${diffDays} hari yang lalu`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return '1 minggu yang lalu';
  if (diffWeeks < 4) return `${diffWeeks} minggu yang lalu`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 bulan yang lalu';
  if (diffMonths < 12) return `${diffMonths} bulan yang lalu`;

  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? '1 tahun yang lalu' : `${diffYears} tahun yang lalu`;
}

function BeritaDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [allBerita, setAllBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    dataService.getBeritaList().then((data) => {
      setAllBerita(data);
      setLoading(false);
    });
  }, [slug]);

  const berita = useMemo(
    () => allBerita.find((b) => createBeritaSlug(b.judul, b.tanggal) === slug) ?? null,
    [allBerita, slug]
  );

  const beritaLainnya = useMemo(
    () => allBerita.filter((b) => createBeritaSlug(b.judul, b.tanggal) !== slug).slice(0, 3),
    [allBerita, slug]
  );

  const handleShare = async () => {
    const shareData = {
      title: berita?.judul ?? 'Berita Kelurahan Borimasunggu',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // dibatalkan oleh pengguna, abaikan
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Memuat berita...</p>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          Berita tidak ditemukan
        </p>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Berita yang Anda cari mungkin sudah dihapus atau tautannya salah.
        </p>
        <Link to="/berita" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Berita
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 1. Header & Meta Info */}
      <section className="pt-28 md:pt-32 pb-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badges (Kategori & Eksternal Tag) */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                {berita.kategori}
              </span>
              {berita.isEksternal && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  <Globe className="w-3.5 h-3.5" />
                  {berita.namaSumber || 'Berita Eksternal'}
                </span>
              )}
            </div>

            {/* Judul Berita */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 max-w-4xl">
              {berita.judul}
            </h1>

            {/* Meta Info & Bagikan */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  {berita.penulis || 'Admin Kelurahan'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(berita.tanggal)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatRelativeTime(berita.tanggal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-sm transition-all"
              >
                <Share2 className="w-4 h-4" />
                Bagikan
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Konten Utama & Sidebar */}
      <section className="py-8 md:py-10">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Kolom Artikel Utama */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Gambar Utama (Hanya ditampilkan jika ada gambar) */}
              {berita.gambar && (
                <div className="overflow-hidden rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                  <img
                    src={berita.gambar}
                    alt={berita.judul}
                    className="w-full aspect-[16/9] object-cover"
                  />
                </div>
              )}

              {/* Isi Teks Berita */}
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
                    {berita.konten}
                  </p>
                </div>

                {/* Box Sumber Berita Eksternal */}
                {berita.isEksternal && (
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          Sumber Berita Eksternal
                        </span>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                          {berita.namaSumber || 'Media Luar'}
                        </h4>
                      </div>

                      {berita.linkAsli && (
                        <a
                          href={berita.linkAsli}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
                        >
                          <span>Baca Artikel Asli</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.article>

            {/* Sidebar: Berita Lainnya */}
            <aside>
              <div className="sticky top-28 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  Berita Lainnya
                </h2>
                <div className="space-y-4">
                  {beritaLainnya.map((b) => (
                    <Link
                      key={b.id}
                      to={`/berita/${createBeritaSlug(b.judul, b.tanggal)}`}
                      className="flex gap-3.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      {b.gambar ? (
                        <img
                          src={b.gambar}
                          alt={b.judul}
                          className="w-20 h-20 rounded-lg object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center text-xs text-slate-400">
                          No Image
                        </div>
                      )}
                      <div className="min-w-0 flex flex-col justify-center">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {b.judul}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(b.tanggal)}</p>
                      </div>
                    </Link>
                  ))}
                  {beritaLainnya.length === 0 && (
                    <p className="text-sm text-slate-400">Belum ada berita lainnya.</p>
                  )}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </div>
  );
}

export default memo(BeritaDetail);