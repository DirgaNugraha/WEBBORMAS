import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Newspaper, CalendarDays, ChevronRight, Quote,
} from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import { dataService } from '../services/dataService';
import { getIcon, colorMap } from '../lib/icons';
import { formatDateShort, formatNumber } from '../lib/format';

function Beranda() {
  const kelurahanInfo = useMemo(() => dataService.getKelurahanInfo(), []);
  const statsData = useMemo(() => dataService.getStatsData(), []);
  const programList = useMemo(() => dataService.getProgramList(), []);
  const testimonialList = useMemo(() => dataService.getTestimonialList(), []);
  const upcomingAgenda = useMemo(() => dataService.getUpcomingAgenda().slice(0, 3), []);
  const latestBerita = useMemo(() => dataService.getBeritaList().slice(0, 3), []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2692657/pexels-photo-2692657.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Borimasunggu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-secondary-800/85" />
          <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-20" />
        </div>

        <div className="container-page relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="badge bg-white/15 backdrop-blur-sm border border-white/20 text-white mb-5">
              Selamat Datang
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 text-balance">
              Kelurahan <span className="text-secondary-300">Borimasunggu</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl leading-relaxed">
              {kelurahanInfo.visi}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/profil" className="btn-primary">
                Pelajari Lebih Lanjut
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/layanan"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 active:scale-95 transition-all duration-200"
              >
                Layanan Publik
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
      </section>

      {/* Stats */}
      <section className="container-page -mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsData.map((stat, i) => {
            const Icon = getIcon(stat.icon);
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card card-hover p-5 md:p-6 text-center"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${colorMap[stat.color] ?? colorMap.primary} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* About preview */}
      <section className="section-padding">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300 mb-3">
                Tentang Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-5">
                Profil Singkat Kelurahan Borimasunggu
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {kelurahanInfo.sejarah}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Kecamatan</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{kelurahanInfo.kecamatan}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Kabupaten</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{kelurahanInfo.kabupaten}</div>
                </div>
              </div>
              <Link to="/profil" className="btn-outline">
                Selengkapnya
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/53610/large-sandbox-2207085.jpg?auto=compress&cs=tinysrgb&w=800"
                  alt="Kantor Kelurahan"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden md:block">
                <div className="bg-primary-600 text-white p-6 rounded-2xl shadow-xl max-w-[200px]">
                  <div className="text-3xl font-bold">{formatNumber(kelurahanInfo.jumlahPenduduk)}</div>
                  <div className="text-sm text-primary-100 mt-1">Jumlah Penduduk</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-slate-100 dark:bg-slate-900/50 section-padding">
        <div className="container-page">
          <SectionTitle
            badge="Program Unggulan"
            title="Program Pembangunan Kelurahan"
            subtitle="Beragam program strategis untuk mewujudkan kelurahan yang maju dan sejahtera."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programList.map((program, i) => {
              const Icon = getIcon(program.icon);
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card card-hover p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mb-4 shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{program.judul}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{program.deskripsi}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${program.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{program.progress}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Berita + Agenda */}
      <section className="section-padding">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Berita */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Newspaper className="w-7 h-7 text-primary-600" />
                  Berita Terbaru
                </h2>
                <Link to="/berita" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  Lihat Semua <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-5">
                {latestBerita.map((berita, i) => (
                  <motion.article
                    key={berita.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="card card-hover overflow-hidden flex flex-col sm:flex-row"
                  >
                    <div className="sm:w-48 shrink-0">
                      <img src={berita.gambar} alt={berita.judul} className="w-full h-48 sm:h-full object-cover" />
                    </div>
                    <div className="p-5 flex-1">
                      <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 mb-2">
                        {berita.kategori}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{berita.judul}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{berita.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{formatDateShort(berita.tanggal)}</span>
                        <span>&bull;</span>
                        <span>{berita.penulis}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Agenda */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <CalendarDays className="w-7 h-7 text-secondary-600" />
                  Agenda
                </h2>
                <Link to="/agenda" className="text-sm font-semibold text-secondary-600 dark:text-secondary-400 hover:underline flex items-center gap-1">
                  Lihat <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingAgenda.map((agenda, i) => (
                  <motion.div
                    key={agenda.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="card card-hover p-5 flex gap-4"
                  >
                    <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex flex-col items-center justify-center text-white">
                      <span className="text-lg font-bold leading-none">{new Date(agenda.tanggal).getDate()}</span>
                      <span className="text-[10px] uppercase mt-0.5">
                        {new Date(agenda.tanggal).toLocaleDateString('id-ID', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300 mb-1.5 text-[10px]">
                        {agenda.kategori}
                      </span>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">{agenda.judul}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{agenda.lokasi}</p>
                      <p className="text-xs text-slate-400 mt-1">{agenda.waktu}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl" />
        <div className="container-page relative">
          <SectionTitle
            badge="Testimoni"
            title="Apa Kata Masyarakat"
            subtitle="Pendapat dan pengalaman warga serta mitra Kelurahan Borimasunggu."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonialList.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
              >
                <Quote className="w-8 h-8 text-secondary-300 mb-4" />
                <p className="text-white/90 text-sm leading-relaxed mb-5">"{t.pesan}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.nama} className="w-11 h-11 rounded-full object-cover border-2 border-white/30" />
                  <div>
                    <div className="font-semibold text-white text-sm">{t.nama}</div>
                    <div className="text-xs text-primary-100">{t.peran}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 to-secondary-700 p-10 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-grid-pattern bg-[size:30px_30px] opacity-20" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Butuh Bantuan?</h2>
              <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                Hubungi kami untuk pelayanan administrasi atau pertanyaan seputar Kelurahan Borimasunggu.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/kontak" className="btn-secondary">
                  Hubungi Kami
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/layanan" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 active:scale-95 transition-all duration-200">
                  Lihat Layanan
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default memo(Beranda);
