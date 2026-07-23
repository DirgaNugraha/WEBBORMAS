import { memo, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import kantorlurah from '../aset/kantor kelurahan.webp';
import {
  ArrowRight, Newspaper, CalendarDays, ChevronRight, Quote,
} from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import { dataService } from '../services/dataService';
import { getIcon, colorMap } from '../lib/icons';
import { formatDateShort } from '../lib/format';

import type {
  KelurahanInfo, StatItem, ProgramItem, TestimonialItem, Agenda, Berita,
} from '../types';

// Urutan tampil kartu statistik di beranda (prioritas tetap, tidak tergantung kolom `urutan` di DB)
const statOrderPriority = ['penduduk', 'wilayah', 'tetangga', 'warga'];

function getStatPriority(label: string) {
  const lower = label.toLowerCase();
  const idx = statOrderPriority.findIndex((keyword) => lower.includes(keyword));
  return idx === -1 ? statOrderPriority.length : idx;
}

function Beranda() {
  const [kelurahanInfo, setKelurahanInfo] = useState<KelurahanInfo | null>(null);
  const [statsData, setStatsData] = useState<StatItem[]>([]);
  const [programList, setProgramList] = useState<ProgramItem[]>([]);
  const [testimonialList, setTestimonialList] = useState<TestimonialItem[]>([]);
  const [upcomingAgenda, setUpcomingAgenda] = useState<Agenda[]>([]);
  const [latestBerita, setLatestBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [info, stats, program, testimonial, agenda, berita] = await Promise.all([
        dataService.getKelurahanInfo(),
        dataService.getStatsData(),
        dataService.getProgramList(),
        dataService.getTestimonialList(),
        dataService.getUpcomingAgenda(),
        dataService.getBeritaList(),
      ]);
      setKelurahanInfo(info);
      setStatsData(stats);
      setProgramList(program);
      setTestimonialList(testimonial);
      setUpcomingAgenda(agenda.slice(0, 3));
      setLatestBerita(berita.slice(0, 3));
      setLoading(false);
    }
    loadData();
  }, []);

  // Gabungkan data statistik: nilai "Jumlah Penduduk" & "Luas Wilayah"
  // diambil dari profil_kelurahan (satu sumber kebenaran, diedit via ProfilAdmin),
  // sementara kartu lain (RT, RW, dll) tetap dari tabel statistik_beranda.
  // Urutan tampil dipaksa: Penduduk -> Wilayah -> RT -> RW.
  const mergedStats = useMemo(() => {
    if (!kelurahanInfo) return statsData;

    const merged = statsData.map((stat) => {
      const label = stat.label.toLowerCase();

      if (label.includes('penduduk')) {
        return {
          ...stat,
          value: kelurahanInfo.jumlahPenduduk.toLocaleString('id-ID'),
        };
      }

      if (label.includes('wilayah')) {
        return {
          ...stat,
          value: kelurahanInfo.luasWilayah,
        };
      }

      return stat;
    });

    return [...merged].sort((a, b) => getStatPriority(a.label) - getStatPriority(b.label));
  }, [statsData, kelurahanInfo]);

  if (loading || !kelurahanInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Memuat data...</p>
      </div>
    );
  }

  return (
    <div>
          {/* Hero */}
<section className="relative min-h-screen flex items-center overflow-hidden">
  <div className="absolute inset-0">
    <img
      src= {kantorlurah}
      alt="Borimasunggu"
      className="w-full h-full object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-secondary-800/85" />
    <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-20" />
  </div>

  <div className="relative z-10 flex items-center min-h-screen w-full">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl pl-6 pr-6 md:pl-12 md:pr-12 lg:pl-24 lg:pr-0 text-left"
    >
      <span className="inline-flex items-center px-5 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
        Selamat Datang
      </span>

      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[0.95] tracking-tight mb-8">
        Kelurahan
        <br />
        <span className="text-secondary-300">
          Borimasunggu
        </span>
      </h1>

      <p className="text-lg md:text-xl text-primary-100 max-w-2xl leading-relaxed mb-10">
        {kelurahanInfo.visi}
      </p>

      <div className="flex flex-wrap items-center gap-5">
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
          {mergedStats.map((stat, i) => {
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
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.886239049808!2d119.51715200000001!3d-4.789558999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe4e98b7114b75%3A0x14d9bee274fb570f!2sKantor%20Lurah%20Borimasunggu!5e0!3m2!1sid!2sid!4v1783755004799!5m2!1sid!2sid"
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Lokasi Kantor Lurah Borimasunggu"
        className="w-full"
      />
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
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge bg-white/15 border border-white/20 text-white mb-3">
              Testimoni
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
              Apa Kata Masyarakat
            </h2>

            <p className="text-white/80">
              Pendapat dan pengalaman warga serta mitra Kelurahan Borimasunggu.
            </p>
          </div>
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