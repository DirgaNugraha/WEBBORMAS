import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Phone, Mail, Clock, Users, Map, Target, Eye, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import { dataService } from '../services/dataService';

function ProfilKelurahan() {
  const kelurahanInfo = useMemo(() => dataService.getKelurahanInfo(), []);
  const pejabatList = useMemo(() => dataService.getPejabatList(), []);

  const infoItems = [
    { icon: MapPin, label: 'Alamat', value: kelurahanInfo.alamat },
    { icon: Phone, label: 'Telepon', value: kelurahanInfo.telepon },
    { icon: Mail, label: 'Email', value: kelurahanInfo.email },
    { icon: Clock, label: 'Jam Layanan', value: kelurahanInfo.jamLayanan },
    { icon: Users, label: 'Penduduk', value: `${kelurahanInfo.jumlahPenduduk.toLocaleString('id-ID')} jiwa` },
    { icon: Map, label: 'Luas Wilayah', value: kelurahanInfo.luasWilayah },
  ];

  return (
    <div>
      <PageHeader
        title="Profil Kelurahan"
        subtitle="Mengenal lebih dekat Kelurahan Borimasunggu, sejarah, visi, misi, dan struktur pemerintahannya."
        icon={<Building2 className="w-8 h-8 text-white" />}
      />

      {/* Sejarah & Info */}
      <section className="section-padding">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <SectionTitle title="Sejarah Kelurahan" centered={false} badge="Sejarah" />
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {kelurahanInfo.sejarah}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card p-6 h-fit"
            >
              <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-lg">Informasi Umum</h3>
              <ul className="space-y-4">
                {infoItems.map((item) => (
                  <li key={item.label} className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{item.value}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-slate-100 dark:bg-slate-900/50 section-padding">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Visi */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-900/30 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-5 shadow-lg">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Visi</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {kelurahanInfo.visi}
                </p>
              </div>
            </motion.div>

            {/* Misi */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-100 dark:bg-secondary-900/30 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center mb-5 shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Misi</h3>
                <ul className="space-y-3">
                  {kelurahanInfo.misi.map((misi, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary-600 dark:text-secondary-400 shrink-0 mt-0.5" />
                      <span className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{misi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi / Pejabat */}
      <section className="section-padding">
        <div className="container-page">
          <SectionTitle
            badge="Struktur Organisasi"
            title="Pejabat Kelurahan Borimasunggu"
            subtitle="Susunan pejabat yang bertugas melayani masyarakat Kelurahan Borimasunggu."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pejabatList.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card card-hover overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={p.foto}
                    alt={p.nama}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="badge bg-primary-600 text-white">{p.jabatan}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 dark:text-white">{p.nama}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NIP: {p.nip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default memo(ProfilKelurahan);
