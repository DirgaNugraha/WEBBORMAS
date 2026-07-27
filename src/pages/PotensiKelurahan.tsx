import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { dataService } from '../services/dataService';
import { getIcon } from '../lib/icons';
import type { Potensi } from '../types';

function PotensiKelurahan() {
  const [potensiList, setPotensiList] = useState<Potensi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const potensi = await dataService.getPotensiList();
      setPotensiList(potensi);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Memuat data potensi...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Potensi Kelurahan"
        subtitle="Beragam potensi alam, pertanian, peternakan, kerajinan, dan ekonomi yang dimiliki Kelurahan Borimasunggu."
        icon={<Sprout className="w-8 h-8 text-white" />}
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {potensiList.map((potensi, i) => {
              const Icon = getIcon(potensi.icon);
              return (
                <motion.article
                  key={potensi.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card card-hover overflow-hidden group"
                >
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={potensi.gambar}
                      alt={potensi.nama}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="badge bg-secondary-500/90 text-white">{potensi.kategori}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{potensi.nama}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{potensi.deskripsi}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
export default memo(PotensiKelurahan);
