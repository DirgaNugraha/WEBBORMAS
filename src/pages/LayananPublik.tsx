import { memo, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock, BadgeDollarSign, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/Modal';
import { dataService } from '../services/dataService';
import { getIcon } from '../lib/icons';
import type { Layanan } from '../types';

function LayananPublik() {
  const layananList = useMemo(() => dataService.getLayananList(), []);
  const [selected, setSelected] = useState<Layanan | null>(null);

  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <div>
      <PageHeader
        title="Layanan Publik"
        subtitle="Pelayanan administrasi dan publik yang tersedia di Kantor Kelurahan Borimasunggu."
        icon={<Briefcase className="w-8 h-8 text-white" />}
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {layananList.map((layanan, i) => {
              const Icon = getIcon(layanan.icon);
              return (
                <motion.div
                  key={layanan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelected(layanan)}
                  className="card card-hover p-6 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{layanan.nama}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{layanan.deskripsi}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300">
                      <Clock className="w-3 h-3" />
                      {layanan.durasi}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info banner */}
      <section className="bg-slate-100 dark:bg-slate-900/50 section-padding">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8 md:p-10 max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
              <BadgeDollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Pelayanan Gratis</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Seluruh layanan administrasi di Kelurahan Borimasunggu tidak dipungut biaya (gratis).
              Masyarakat cukup membawa persyaratan yang dibutuhkan dan mengunjungi kantor kelurahan
              pada jam pelayanan.
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 font-semibold">
              <Clock className="w-5 h-5" />
              Senin - Jumat, 07:30 - 16:00 WITA
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <Modal isOpen={selected !== null} onClose={handleClose}>
        {selected && (
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg shrink-0">
                {(() => {
                  const Icon = getIcon(selected.icon);
                  return <Icon className="w-7 h-7 text-white" />;
                })()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selected.nama}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selected.deskripsi}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5" /> Durasi
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{selected.durasi}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                  <BadgeDollarSign className="w-3.5 h-3.5" /> Biaya
                </div>
                <div className="text-sm font-semibold text-secondary-600 dark:text-secondary-400">{selected.biaya}</div>
              </div>
            </div>

            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Persyaratan:</h3>
            <ul className="space-y-2">
              {selected.syarat.map((s, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-secondary-600 dark:text-secondary-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default memo(LayananPublik);
