import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { dataService } from '../services/dataService';
import { getIcon, colorMap } from '../lib/icons';
import type { Potensi, StatItem } from '../types';

function PotensiKelurahan() {
  const [potensiList, setPotensiList] = useState<Potensi[]>([]);
  const [infographicData, setInfographicData] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [potensi, infografis] = await Promise.all([
        dataService.getPotensiList(),
        dataService.getPotensiInfografis(),
      ]);
      setPotensiList(potensi);
      setInfographicData(infografis);
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

      {/* Infographic */}
      <section className="bg-slate-100 dark:bg-slate-900/50 section-padding">
        <div className="container-page">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {infographicData.map((item, i) => {
              const Icon = getIcon(item.icon);
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-6 flex items-center gap-4"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[item.color] ?? colorMap.primary} flex items-center justify-center shrink-0 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{item.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default memo(PotensiKelurahan);