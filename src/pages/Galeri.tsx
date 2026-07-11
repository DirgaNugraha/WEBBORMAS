import { memo, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Images, Calendar } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/Modal';
import { dataService } from '../services/dataService';
import { formatDate } from '../lib/format';

function Galeri() {
  const allGaleri = useMemo(() => dataService.getGaleriList(), []);
  const kategoriList = useMemo(() => dataService.getGaleriKategori(), []);

  const [activeKategori, setActiveKategori] = useState('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => activeKategori === 'Semua' ? allGaleri : allGaleri.filter((g) => g.kategori === activeKategori),
    [allGaleri, activeKategori]
  );

  const handleClose = useCallback(() => setLightboxIndex(null), []);

  return (
    <div>
      <PageHeader
        title="Galeri"
        subtitle="Dokumentasi kegiatan, potensi, dan momen di Kelurahan Borimasunggu."
        icon={<Images className="w-8 h-8 text-white" />}
      />

      <section className="section-padding">
        <div className="container-page">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {kategoriList.map((k) => (
              <button
                key={k}
                onClick={() => setActiveKategori(k)}
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

          {/* Grid */}
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

      {/* Lightbox */}
      <Modal isOpen={lightboxIndex !== null} onClose={handleClose} maxWidth="max-w-3xl">
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <div>
            <img
              src={filtered[lightboxIndex].gambar}
              alt={filtered[lightboxIndex].judul}
              className="w-full max-h-[70vh] object-contain"
            />
            <div className="p-6 text-center">
              <span className="badge bg-primary-600 text-white">{filtered[lightboxIndex].kategori}</span>
              <h3 className="text-white font-bold text-xl mt-2">{filtered[lightboxIndex].judul}</h3>
              <p className="text-white/60 text-sm mt-1">
                {formatDate(filtered[lightboxIndex].tanggal)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default memo(Galeri);
