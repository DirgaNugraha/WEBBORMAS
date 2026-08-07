import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Maximize2,
  Inbox,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/Modal';
import { dataService } from '../services/dataService';
import { formatDate } from '../lib/format';
import type { GaleriItem } from '../types';

// Component Skeleton Loading Grid Galeri
function GaleriSkeletonCard() {
  return (
    <div className="relative aspect-[4/3] w-full rounded-2xl bg-slate-200  animate-pulse overflow-hidden border border-slate-200/80  shadow-xs" />
  );
}

// Sub-komponen Item Galeri (Gambar Grid)
function GaleriCard({
  item,
  index,
  onClick,
}: {
  item: GaleriItem;
  index: number;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const hasValidPhoto = item.gambar && item.gambar.trim() !== '' && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      onClick={onClick}
      className="group relative aspect-[4/3] w-full bg-slate-100  border border-slate-200/90  rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300  cursor-pointer transition-all duration-300"
    >
      {/* Visual Image */}
      {hasValidPhoto ? (
        <img
          src={item.gambar}
          alt={item.judul}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200   flex flex-col items-center justify-center p-4 text-slate-400 ">
          <ImageOff className="w-8 h-8 mb-1.5 opacity-60" />
          <span className="text-[11px] font-semibold tracking-wide">
            Gambar Tidak Tersedia
          </span>
        </div>
      )}

      {/* Floating Action Badge (Kanan Atas Hover) */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="p-2 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/20 text-white shadow-xs">
          <Maximize2 className="w-4 h-4" />
        </div>
      </div>

      {/* Overlay Shader */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Detail Overlay Teks saat Hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <span className="px-2.5 py-0.5 rounded bg-blue-700/90 backdrop-blur-md border border-blue-400/30 text-white text-[10px] font-extrabold uppercase tracking-wider inline-block mb-1.5">
          {item.kategori}
        </span>
        <h3 className="text-white font-extrabold text-sm md:text-base line-clamp-1 leading-snug">
          {item.judul}
        </h3>
        <p className="text-white/80 text-xs flex items-center gap-1.5 mt-1 font-medium">
          <Calendar className="w-3.5 h-3.5 text-blue-300" />
          {formatDate(item.tanggal)}
        </p>
      </div>
    </motion.div>
  );
}

function Galeri() {
  const [allGaleri, setAllGaleri] = useState<GaleriItem[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>(['Semua']);
  const [loading, setLoading] = useState(true);
  const [activeKategori, setActiveKategori] = useState('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [galeri, kategori] = await Promise.all([
        dataService.getGaleriList(),
        dataService.getGaleriKategori(),
      ]);
      setAllGaleri(galeri);
      setKategoriList(kategori);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = useMemo(
    () =>
      activeKategori === 'Semua'
        ? allGaleri
        : allGaleri.filter((g) => g.kategori === activeKategori),
    [allGaleri, activeKategori]
  );

  const handleClose = useCallback(() => setLightboxIndex(null), []);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : filtered.length - 1
    );
  }, [filtered.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null && prev < filtered.length - 1 ? prev + 1 : 0
    );
  }, [filtered.length]);

  return (
    <div className="bg-slate-50  min-h-screen antialiased text-slate-800  pb-20">
      {/* Header Halaman */}
      <PageHeader
        title="Galeri Kelurahan"
        subtitle="Dokumentasi kegiatan, program kerja, potensi wilayah, dan momen di Kelurahan Borimasunggu."
        icon={<Images className="w-8 h-8 text-blue-700 " />}
      />

      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls Bar & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700  bg-blue-50  px-3 py-1 rounded-md border border-blue-100 ">
              Arsip Dokumentasi
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900  mt-1">
              Koleksi Foto & Kegiatan
            </h2>
          </div>

          {/* Filter Bar Chips */}
          {!loading && kategoriList.length > 1 && (
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/60  rounded-2xl border border-slate-200/80  overflow-x-auto max-w-full">
              {kategoriList.map((k) => {
                const isActive = activeKategori === k;
                return (
                  <button
                    key={k}
                    onClick={() => {
                      setActiveKategori(k);
                      setLightboxIndex(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-slate-600  hover:text-slate-900  hover:bg-slate-100 '
                    }`}
                  >
                    {k}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Body Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <GaleriSkeletonCard key={idx} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            layout
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {filtered.map((item, i) => (
                <GaleriCard
                  key={item.id}
                  item={item}
                  index={i}
                  onClick={() => setLightboxIndex(i)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State Jika Data Kosong */
          <div className="py-16 text-center bg-white  rounded-3xl border border-slate-200  p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50  border border-blue-100  flex items-center justify-center mx-auto mb-4 text-blue-700 ">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900  text-base">
              Dokumentasi Tidak Ditemukan
            </h3>
            <p className="text-xs md:text-sm text-slate-500  mt-1">
              Tidak ada foto atau gambar pada kategori{' '}
              <span className="font-semibold text-slate-700 ">
                "{activeKategori}"
              </span>
              .
            </p>
          </div>
        )}
      </section>

      {/* Lightbox Modal Navigation */}
      <Modal
        isOpen={lightboxIndex !== null}
        onClose={handleClose}
        maxWidth="max-w-4xl"
      >
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <div className="space-y-4 p-1">
            {/* Frame Utama Gambar Lightbox */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center p-2 min-h-[320px] max-h-[65vh]">
              <img
                src={filtered[lightboxIndex].gambar}
                alt={filtered[lightboxIndex].judul}
                className="w-full max-h-[60vh] object-contain rounded-xl select-none"
              />

              {/* Tombol Navigasi Panah Lightbox */}
              {filtered.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 border border-white/20 text-white shadow-md hover:bg-slate-900 hover:scale-110 transition-all flex items-center justify-center backdrop-blur-md"
                    aria-label="Foto Sebelum"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 border border-white/20 text-white shadow-md hover:bg-slate-900 hover:scale-110 transition-all flex items-center justify-center backdrop-blur-md"
                    aria-label="Foto Berikut"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Meta Informasi Foto di Lightbox */}
            <div className="px-2 pb-1 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-blue-50  text-blue-700  border border-blue-100 ">
                  {filtered[lightboxIndex].kategori}
                </span>
                <span className="text-xs font-medium text-slate-500  flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-700 " />
                  {formatDate(filtered[lightboxIndex].tanggal)}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900  leading-snug">
                {filtered[lightboxIndex].judul}
              </h3>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default memo(Galeri);