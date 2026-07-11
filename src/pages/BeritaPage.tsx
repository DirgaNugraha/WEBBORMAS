import { memo, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, User, Search } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/Modal';
import { dataService } from '../services/dataService';
import { formatDate } from '../lib/format';
import type { Berita } from '../types';

function BeritaPage() {
  const allBerita = useMemo(() => dataService.getBeritaList(), []);
  const kategoriList = useMemo(
    () => ['Semua', ...Array.from(new Set(allBerita.map((b) => b.kategori)))],
    [allBerita]
  );

  const [selected, setSelected] = useState<Berita | null>(null);
  const [activeKategori, setActiveKategori] = useState('Semua');
  const [search, setSearch] = useState('');

  const handleClose = useCallback(() => setSelected(null), []);

  const filtered = useMemo(() => {
    return allBerita.filter((b) => {
      const matchKategori = activeKategori === 'Semua' || b.kategori === activeKategori;
      const matchSearch = b.judul.toLowerCase().includes(search.toLowerCase());
      return matchKategori && matchSearch;
    });
  }, [allBerita, activeKategori, search]);

  return (
    <div>
      <PageHeader
        title="Berita"
        subtitle="Informasi terbaru seputar kegiatan, program, dan peristiwa di Kelurahan Borimasunggu."
        icon={<Newspaper className="w-8 h-8 text-white" />}
      />

      <section className="section-padding">
        <div className="container-page">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <div className="flex flex-wrap gap-2">
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
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((berita, i) => (
              <motion.article
                key={berita.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(berita)}
                className="card card-hover overflow-hidden cursor-pointer group"
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    src={berita.gambar}
                    alt={berita.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge bg-primary-600 text-white">{berita.kategori}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {berita.judul}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{berita.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(berita.tanggal)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {berita.penulis}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 dark:text-slate-400">Tidak ada berita yang ditemukan.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <Modal isOpen={selected !== null} onClose={handleClose} maxWidth="max-w-2xl">
        {selected && (
          <div>
            <div className="relative">
              <img src={selected.gambar} alt={selected.judul} className="w-full h-64 object-cover" />
              <div className="absolute bottom-3 left-4">
                <span className="badge bg-primary-600 text-white">{selected.kategori}</span>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{selected.judul}</h2>
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selected.tanggal)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selected.penulis}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selected.konten}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default memo(BeritaPage);
