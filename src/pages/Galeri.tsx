import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Images, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/Modal';
import { dataService } from '../services/dataService';
import { formatDate } from '../lib/format';
import type { GaleriItem } from '../types';

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
    () => (activeKategori === 'Semua' ? allGaleri : allGaleri.filter((g) => g.kategori === activeKategori)),
    [allGaleri, activeKategori]
  );

  const handleClose = useCallback(() => setLightboxIndex(null), []);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filtered.length - 1));
  }, [filtered.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null && prev < filtered.length - 1 ? prev + 1 : 0));
  }, [filtered.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Memuat galeri...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Galeri"
        subtitle="Dokumentasi kegiatan, potensi, dan momen di Kelurahan Borimasunggu."
        icon={<Images className="w-8 h-8 text-white" />}
      />

      <section className="section-padding">
        <div className="container-page">
          {/* Filter Kategori */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {kategoriList.map((k) => (
              <button
                key={k}
                onClick={() => {
                  setActiveKategori(k);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeKategori === k
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Grid Galeri */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setLightboxIndex(i)}
                className="card card-hover overflow-hidden cursor-pointer group relative aspect-[4/3]"
              >
                <img
                  src={item.gambar}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <span className="badge bg-primary-600/90 text-white mb-2">{item.kategori}</span>
                  <h3 className="text-white font-semibold text-sm">{item.judul}</h3>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.tanggal)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal Sempurna */}
      <Modal isOpen={lightboxIndex !== null} onClose={handleClose} maxWidth="max-w-3xl">
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <div className="space-y-5 p-1">
            {/* Frame Gambar dengan Background Soft Neutral */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center p-2 min-h-[300px] max-h-[60vh]">
              <img
                src={filtered[lightboxIndex].gambar}
                alt={filtered[lightboxIndex].judul}
                className="w-full max-h-[58vh] object-contain rounded-xl select-none"
              />

              {/* Tombol Navigasi Panah Cantik */}
              {filtered.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-white shadow-md hover:bg-white dark:hover:bg-slate-900 hover:scale-110 transition-all flex items-center justify-center backdrop-blur-md"
                    aria-label="Sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-white shadow-md hover:bg-white dark:hover:bg-slate-900 hover:scale-110 transition-all flex items-center justify-center backdrop-blur-md"
                    aria-label="Selanjutnya"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Informasi Detail dengan Padding yang Pas & Rapi */}
            <div className="px-3 pb-2 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
                  {filtered[lightboxIndex].kategori}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(filtered[lightboxIndex].tanggal)}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
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