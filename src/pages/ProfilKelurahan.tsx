import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Map,
  Target,
  Eye,
  Building2,
  Award,
  ShieldCheck,
  UserCheck,
  Landmark
} from 'lucide-react';

import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import { dataService } from '../services/dataService';
import type { KelurahanInfo, Pejabat } from '../types';

// Sub-komponen Kartu Pejabat Institusional
function PejabatCard({ pejabat, index }: { pejabat: Pejabat; index: number }) {
  const [imgError, setImgError] = useState(false);
  const hasValidPhoto = pejabat.foto && pejabat.foto.trim() !== '' && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Container Foto */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
        {hasValidPhoto ? (
          <img
            src={pejabat.foto}
            alt={pejabat.nama}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Siluet Profile Netral khas Official Portal */
          <div className="w-full h-full bg-gradient-to-b from-slate-100 to-slate-200 flex items-end justify-center pt-6">
            <svg
              className="w-36 h-36 text-slate-400 translate-y-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}

        {/* Badge Jabatan */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-blue-700/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wide shadow-xs border border-blue-500/30">
            {pejabat.jabatan}
          </span>
        </div>
      </div>

      {/* Detail Konten Pejabat */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-bold text-slate-900 text-base md:text-lg leading-snug group-hover:text-blue-700 transition-colors">
            {pejabat.nama}
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium text-slate-400">NIP</span>
            <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {pejabat.nip || '-'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProfilKelurahan() {
  const [kelurahanInfo, setKelurahanInfo] = useState<KelurahanInfo | null>(null);
  const [pejabatList, setPejabatList] = useState<Pejabat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [info, pejabat] = await Promise.all([
        dataService.getKelurahanInfo(),
        dataService.getPejabatList(),
      ]);
      setKelurahanInfo(info);
      setPejabatList(pejabat);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || !kelurahanInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">
          Memuat Profil Kelurahan Borimasunggu...
        </p>
      </div>
    );
  }

  const infoStats = [
    { icon: MapPin, label: 'Alamat Kantor', value: kelurahanInfo.alamat, span: 'col-span-full lg:col-span-2' },
    { icon: Clock, label: 'Jam Operasional Layanan', value: kelurahanInfo.jamLayanan, span: 'col-span-1' },
    { icon: Users, label: 'Total Populer Kependudukan', value: `${kelurahanInfo.jumlahPenduduk.toLocaleString('id-ID')} Jiwa`, span: 'col-span-1' },
    { icon: Map, label: 'Cakupan Luas Wilayah', value: kelurahanInfo.luasWilayah, span: 'col-span-1' },
    { icon: Phone, label: 'Kontak Resmi Hotline', value: kelurahanInfo.telepon, span: 'col-span-1' },
    { icon: Mail, label: 'Surel / Email Resmi', value: kelurahanInfo.email, span: 'col-span-1 lg:col-span-2' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased selection:bg-blue-600 selection:text-white pb-20">
      {/* Header Halaman Resmi */}
      <PageHeader
        title="Profil Kelurahan Borimasunggu"
        subtitle="Informasi kelembagaan, latar belakang sejarah, visi & misi, serta struktur aparatur pemerintahan kelurahan."
        icon={<Landmark className="w-8 h-8 text-blue-700" />}
      />

      {/* Section 1: Ringkasan Informasi Cepat (Metrics Grid) */}
      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
            Data Singkat
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-2">
            Ringkasan Wilayah & Layanan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {infoStats.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-4 ${item.span || ''}`}
            >
              <div className="p-3 rounded-xl bg-blue-50 text-blue-700 shrink-0 border border-blue-100">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="block text-sm md:text-base font-bold text-slate-900 mt-1 leading-snug">
                  {item.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 2: Sejarah & Rekam Jejak Wilayah */}
      <section className="py-8 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 lg:p-12 shadow-xs relative overflow-hidden">
          <div className="max-w-4xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Rekam Jejak Wilayah</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
              Sejarah & Latar Belakang Borimasunggu
            </h2>

            <div className="prose prose-slate max-w-none text-slate-600 text-base md:text-lg leading-relaxed whitespace-pre-line">
              {kelurahanInfo.sejarah}
            </div>

            {/* Guarantees / Keunggulan */}
            <div className="grid sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Pemerintahan Akuntabel</span>
              </div>
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-blue-700 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Pelayanan Berbasis Warga</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-700 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Integritas Tinggi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Visi & Misi */}
      <section className="py-16 mt-8 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Pedoman Organisasi"
            title="Visi & Misi Kelurahan"
            subtitle="Landasan, komitmen, dan sasaran strategis pelaksanaan pembangunan serta tata kelola pemerintahan."
          />

          <div className="grid lg:grid-cols-12 gap-8 items-stretch mt-10">
            {/* Visi (5 Columns) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-blue-300" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                  Visi Utama
                </span>
                <h3 className="text-xl md:text-2xl font-black mt-2 mb-4 leading-snug text-white">
                  Arah Pembangunan & Layanan
                </h3>
              </div>

              <blockquote className="border-l-4 border-blue-500 pl-4 py-1 text-slate-200 text-base md:text-lg font-medium italic leading-relaxed my-4">
                "{kelurahanInfo.visi}"
              </blockquote>

              <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
                Landasan Kerja Pemerintah Kelurahan Borimasunggu
              </div>
            </motion.div>

            {/* Misi (7 Columns) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
                      Misi Strategis
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                      Langkah Pelaksanaan
                    </h3>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {kelurahanInfo.misi.map((misi, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {i + 1}
                      </div>
                      <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                        {misi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Aparatur Kelurahan / Struktur Pejabat */}
      <section className="py-16 md:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Aparatur Kelurahan"
          title="Struktur Organisasi & Pejabat"
          subtitle="Susunan jajaran pemerintah kelurahan yang siap memberikan pelayanan publik yang ramah, profesional, dan akuntabel."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {pejabatList.map((p, i) => (
            <PejabatCard key={p.id || i} pejabat={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default memo(ProfilKelurahan);