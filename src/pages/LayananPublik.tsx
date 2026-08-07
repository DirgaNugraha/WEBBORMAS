import { memo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock, BadgeCheck, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/Modal';
import { dataService } from '../services/dataService';
import { getIcon } from '../lib/icons';
import type { Layanan } from '../types';

function LayananPublik() {
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Layanan | null>(null);

  useEffect(() => {
    dataService.getLayananList().then((data) => {
      setLayananList(data);
      setLoading(false);
    });
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50  flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600 ">
          Memuat Daftar Layanan Publik...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50  min-h-screen antialiased text-slate-800  pb-20">
      {/* Page Header Modern */}
      <PageHeader
        title="Layanan Publik"
        subtitle="Daftar pelayanan administrasi resmi kependudukan dan umum yang tersedia di Kantor Kelurahan Borimasunggu."
        icon={<Briefcase className="w-8 h-8 text-blue-700 " />}
      />

      {/* Grid Layanan Main Section */}
      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700  bg-blue-50  px-3 py-1 rounded-md border border-blue-100 ">
              Katalog Administrasi
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900  mt-2">
              Jenis Layanan Terpadu
            </h2>
          </div>
          <p className="text-sm text-slate-500 ">
            Klik pada kartu layanan untuk melihat persyaratan dokumen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {layananList.map((layanan, i) => {
            const Icon = getIcon(layanan.icon);
            return (
              <motion.div
                key={layanan.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(layanan)}
                className="group bg-white  rounded-2xl border border-slate-200/90  p-5 shadow-xs hover:shadow-xl hover:border-blue-300  hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Container Icon */}
                  <div className="w-12 h-12 rounded-xl bg-blue-50  border border-blue-100  flex items-center justify-center mb-4 text-blue-700  group-hover:bg-blue-700 group-hover:text-white group-hover:border-blue-700 transition-colors">
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </div>

                  <h3 className="font-bold text-slate-900  text-base md:text-lg mb-2 group-hover:text-blue-700  transition-colors leading-snug">
                    {layanan.nama}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-600  line-clamp-2 leading-relaxed mb-4">
                    {layanan.deskripsi}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100  flex items-center justify-between text-xs font-semibold text-slate-500 ">
                  <span className="flex items-center gap-1.5 bg-slate-100  px-2.5 py-1 rounded-md text-slate-700 ">
                    <Clock className="w-3.5 h-3.5 text-blue-700 " />
                    {layanan.durasi}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-blue-700  font-bold group-hover:translate-x-1 transition-transform">
                    Detail <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Info Banner: Bebas Biaya */}
      <section className="py-8 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white  rounded-3xl border border-slate-200  p-6 md:p-10 shadow-xs relative overflow-hidden"
        >
          <div className="max-w-3xl mx-auto text-center relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50  border border-blue-100  flex items-center justify-center mb-4 text-blue-700 ">
              <BadgeCheck className="w-7 h-7" />
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-900  mb-2">
              Seluruh Pelayanan 100% Gratis
            </h3>

            <p className="text-sm md:text-base text-slate-600  leading-relaxed max-w-2xl mb-6">
              Sesuai ketentuan, seluruh pengurusan administrasi di Kelurahan Borimasunggu 
              <span className="font-bold text-slate-900 "> tidak dipungut biaya apapun (Rp0)</span>. 
              Masyarakat cukup membawa dokumen persyaratan yang valid ke kantor kelurahan.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100  text-slate-700  text-xs md:text-sm font-bold border border-slate-200/80 ">
              <Clock className="w-4 h-4 text-blue-700 " />
              <span>Jam Layanan: Senin - Jumat (08:00 - 16:00 WITA)</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modal Detail Layanan */}
      <Modal isOpen={selected !== null} onClose={handleClose}>
        {selected && (
          <div className="p-6 md:p-8 bg-white  rounded-2xl">
            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100 ">
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                {(() => {
                  const Icon = getIcon(selected.icon);
                  return <Icon className="w-6 h-6" />;
                })()}
              </div>
              <div className="pr-6">
                <h2 className="text-xl font-bold text-slate-900  leading-snug">
                  {selected.nama}
                </h2>
                <p className="text-xs md:text-sm text-slate-500  mt-1">
                  {selected.deskripsi}
                </p>
              </div>
            </div>

            {/* Info Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400  flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-700 " /> Est. Waktu Selesai
                </span>
                <span className="text-sm font-bold text-slate-900 ">
                  {selected.durasi}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400  flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 " /> Biaya Retribusi
                </span>
                <span className="text-sm font-bold text-emerald-600 ">
                  {selected.biaya}
                </span>
              </div>
            </div>

            {/* Persyaratan List */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  mb-3">
                Dokumen Persyaratan:
              </h3>
              <ul className="space-y-2.5 bg-slate-50  p-4 rounded-xl border border-slate-100 ">
                {selected.syarat.map((s, i) => (
                  <li key={i} className="flex gap-3 items-start text-xs md:text-sm text-slate-700 ">
                    <CheckCircle2 className="w-4 h-4 text-blue-700  shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Footer Button */}
            <div className="mt-6 pt-4 border-t border-slate-100  flex justify-end">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900  hover:bg-slate-800  text-white font-bold text-xs tracking-wider transition-all shadow-xs"
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default memo(LayananPublik);