import { memo, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  Calendar,
  User,
  Search,
  Globe,
  ImageOff,
  Inbox,
  ArrowUpRight,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { dataService } from '../services/dataService';
import { formatDate } from '../lib/format';
import type { Berita } from '../types';

// Component Skeleton Loading Kartu Berita
function BeritaSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs animate-pulse flex flex-col">
      <div className="h-52 w-full bg-slate-200" />
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 rounded w-5/6" />
          <div className="h-5 bg-slate-200 rounded w-2/3" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3.5 bg-slate-200 rounded w-full" />
          <div className="h-3.5 bg-slate-200 rounded w-4/5" />
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-3 bg-slate-200 rounded w-24" />
          <div className="h-3 bg-slate-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

// Component Kartu Berita Individu
function BeritaCard({ berita, index }: { berita: Berita; index: number }) {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = berita.gambar && berita.gambar.trim() !== '' && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      {/* Perbaikan Tautan Route: Menggunakan berita.slug || berita.id */}
      <Link
        to={`/berita/${berita.slug || berita.id}`}
        className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
      >
        {/* Visual Media Container */}
        <div className="relative h-52 w-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
          {hasPhoto ? (
            <img
              src={berita.gambar}
              alt={berita.judul}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400">
              <ImageOff className="w-8 h-8 mb-1.5 opacity-50" />
              <span className="text-xs font-medium">Gambar Tidak Tersedia</span>
            </div>
          )}

          {/* Badge Kategori (Kiri Atas) */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
              {berita.kategori}
            </span>
          </div>

          {/* Badge Berita Eksternal (Kanan Atas) */}
          {berita.isEksternal && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-700/90 backdrop-blur-md border border-blue-400/30 text-white font-semibold text-xs shadow-xs">
                <Globe className="w-3 h-3 text-blue-200" />
                <span>{berita.namaSumber || 'Eksternal'}</span>
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-extrabold text-slate-900 text-base md:text-lg group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                {berita.judul}
              </h3>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
            </div>

            <p className="text-xs md:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {berita.excerpt}
            </p>
          </div>

          {/* Meta Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              {formatDate(berita.tanggal)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-700" />
              {berita.penulis || 'Admin'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function BeritaPage() {
  const [allBerita, setAllBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKategori, setActiveKategori] = useState('Semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    dataService.getBeritaList().then((data) => {
      if (!isMounted) return;
      setAllBerita(data);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const kategoriList = useMemo(
    () => ['Semua', ...Array.from(new Set(allBerita.map((b) => b.kategori)))],
    [allBerita]
  );

  const filtered = useMemo(() => {
    return allBerita.filter((b) => {
      const matchKategori =
        activeKategori === 'Semua' || b.kategori === activeKategori;
      const matchSearch = b.judul.toLowerCase().includes(search.toLowerCase());
      return matchKategori && matchSearch;
    });
  }, [allBerita, activeKategori, search]);

  return (
    <div className="bg-slate-50 min-h-screen antialiased text-slate-800 pb-20">
      {/* Page Header */}
      <PageHeader
        title="Berita Kelurahan"
        subtitle="Informasi terbaru seputar kegiatan, program kerja, dan peristiwa di Kelurahan Borimasunggu."
        icon={<Newspaper className="w-8 h-8 text-blue-700" />}
      />

      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bar Filter & Pencarian */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
          {/* Form Pencarian */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari berita atau pengumuman..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-hidden focus:border-blue-700 text-slate-900 placeholder:text-slate-400 shadow-xs transition-all"
            />
          </div>

          {/* Tab Filter Kategori */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-200/80 overflow-x-auto max-w-full">
            {kategoriList.map((k) => {
              const active = activeKategori === k;
              return (
                <button
                  key={k}
                  onClick={() => setActiveKategori(k)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {k}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Body Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <BeritaSkeletonCard key={idx} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((berita, i) => (
                <BeritaCard key={berita.id} berita={berita} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-700">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Berita Tidak Ditemukan
            </h3>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Tidak ada publikasi artikel yang cocok dengan kata kunci atau filter kategori yang dipilih.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default memo(BeritaPage);