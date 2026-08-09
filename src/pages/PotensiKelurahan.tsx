import { memo, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, ImageOff, Layers, ArrowUpRight, Info } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/Modal';
import { dataService } from '../services/dataService';
import type { Potensi } from '../types';

// Component Skeleton Loading Kartu
function PotensiSkeletonCard() {
  return (
    <div className="bg-white  border border-slate-200/90  rounded-2xl overflow-hidden shadow-xs animate-pulse flex flex-col">
      <div className="h-52 sm:h-56 w-full bg-slate-200 " />
      <div className="p-5 md:p-6 space-y-3">
        <div className="h-5 bg-slate-200  rounded w-3/4" />
        <div className="space-y-2 pt-1">
          <div className="h-3.5 bg-slate-200  rounded w-full" />
          <div className="h-3.5 bg-slate-200  rounded w-5/6" />
          <div className="h-3.5 bg-slate-200  rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

// Sub-komponen Kartu Potensi
function PotensiCard({ potensi, index, onSelect }: { potensi: Potensi; index: number; onSelect: (p: Potensi) => void }) {
  const [imgError, setImgError] = useState(false);

  const hasValidPhoto = potensi.gambar && potensi.gambar.trim() !== '' && !imgError;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={() => onSelect(potensi)}
      className="group bg-white  border border-slate-200/90  rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300  hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Visual Image Container */}
      <div className="relative h-52 sm:h-56 w-full bg-slate-100  overflow-hidden flex items-center justify-center">
        {hasValidPhoto ? (
          <img
            src={potensi.gambar}
            alt={potensi.nama}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          /* Placeholder Gambar Kosong/Gagal */
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200/80   flex flex-col items-center justify-center p-4 text-slate-400 ">
            <ImageOff className="w-9 h-9 mb-2 opacity-60" />
            <span className="text-xs font-semibold tracking-wide">Gambar Belum Tersedia</span>
          </div>
        )}

{/* Gradien Overlay Legibilitas Teks */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Badge Kategori (Kanan Bawah Overlay) */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-3 py-1 rounded-md bg-blue-700/90 backdrop-blur-md border border-blue-400/30 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
            {potensi.kategori}
          </span>
        </div>
      </div>

      {/* Deskripsi Konten */}
      <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-slate-900  text-base md:text-lg group-hover:text-blue-700  transition-colors line-clamp-1 leading-snug">
              {potensi.nama}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700  group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
          </div>

          <p className="text-xs md:text-sm text-slate-600  leading-relaxed mt-2.5 line-clamp-3">
            {potensi.deskripsi}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function PotensiKelurahan() {
  const [potensiList, setPotensiList] = useState<Potensi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedPotensi, setSelectedPotensi] = useState<Potensi | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const potensi = await dataService.getPotensiList();
      setPotensiList(potensi);
      setLoading(false);
    }
    loadData();
  }, []);

  // Ambil daftar kategori unik secara dinamis
  const categories = useMemo(() => {
    const unique = Array.from(new Set(potensiList.map((p) => p.kategori)));
    return ['Semua', ...unique];
  }, [potensiList]);

  // Filter daftar potensi berdasarkan kategori
  const filteredPotensi = useMemo(() => {
    if (selectedCategory === 'Semua') return potensiList;
    return potensiList.filter((p) => p.kategori === selectedCategory);
  }, [potensiList, selectedCategory]);

  return (
    <div className="bg-slate-50  min-h-screen antialiased text-slate-800  pb-20">
      {/* Header Halaman */}
      <PageHeader
        title="Potensi Kelurahan"
        subtitle="Komoditas keunggulan daerah, sektor kelautan, pertanian, dan usaha lokal Kelurahan Borimasunggu."
        icon={<Sprout className="w-8 h-8 text-blue-700 " />}
      />

      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls Bar & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700  bg-blue-50  px-3 py-1 rounded-md border border-blue-100 ">
              Sektor Keunggulan
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900  mt-1">
              Potensi Wilayah
            </h2>
          </div>

          {/* Filter Bar Chips */}
          {!loading && categories.length > 1 && (
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/60  rounded-2xl border border-slate-200/80  overflow-x-auto max-w-full">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-slate-600  hover:text-slate-900  hover:bg-slate-100 '
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <PotensiSkeletonCard key={idx} />
            ))}
          </div>
        ) : filteredPotensi.length > 0 ? (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
{filteredPotensi.map((potensi, i) => (
                <PotensiCard
                  key={potensi.id}
                  potensi={potensi}
                  index={i}
                  onSelect={setSelectedPotensi}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State Jika Filter Tidak Menemukan Data */
          <div className="py-16 text-center bg-white  rounded-3xl border border-slate-200  p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50  border border-blue-100  flex items-center justify-center mx-auto mb-4 text-blue-700 ">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900  text-base">
              Belum Ada Data
            </h3>
            <p className="text-xs md:text-sm text-slate-500  mt-1">
              Tidak ditemukan item potensi pada kategori <span className="font-semibold text-slate-700 ">"{selectedCategory}"</span>.
            </p>
</div>
        )}
      </section>

{/* Modal Detail Potensi (Inline) */}
      <Modal
        isOpen={!!selectedPotensi}
        onClose={() => setSelectedPotensi(null)}
        maxWidth="max-w-2xl"
      >
        {selectedPotensi && (
          <div className="p-6 md:p-8 space-y-6">
            {/* Header Modal Potensi */}
            <div className="space-y-3 pr-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider border border-blue-200">
                  {selectedPotensi.kategori}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                {selectedPotensi.nama}
              </h3>
            </div>

            {/* Foto Pendukung */}
            {selectedPotensi.gambar && selectedPotensi.gambar.trim() !== '' && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={selectedPotensi.gambar}
                  alt={selectedPotensi.nama}
                  className="w-full h-56 md:h-72 object-cover"
                />
              </div>
            )}

            {/* Deskripsi Lengkap */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Info className="w-4 h-4 text-blue-700" />
                <span>Deskripsi & Rincian</span>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                {selectedPotensi.deskripsi || 'Tidak ada deskripsi untuk potensi ini.'}
              </div>
            </div>

            {/* Footer Modal Action */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPotensi(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default memo(PotensiKelurahan);
