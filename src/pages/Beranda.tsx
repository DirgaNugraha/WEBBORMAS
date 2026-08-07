import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import kantorlurah from '../aset/kantor kelurahan.webp';
import {
  ArrowRight,
  Newspaper,
  CalendarDays,
  ChevronRight,
  MessageSquare,
  Image as ImageIcon,
  Send,
  ShieldCheck,
  Zap,
  Building2,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { getIcon } from '../lib/icons';
import { formatDateShort, formatDate } from '../lib/format';
import Modal from '../components/Modal';

import type {
  KelurahanInfo,
  StatItem,
  Agenda,
  Berita,
  GaleriItem,
} from '../types';

const statOrderPriority = ['penduduk', 'wilayah', 'tetangga', 'warga'];

function getStatPriority(label: string) {
  const lower = label.toLowerCase();
  const idx = statOrderPriority.findIndex((keyword) => lower.includes(keyword));
  return idx === -1 ? statOrderPriority.length : idx;
}

function Beranda() {
  const [kelurahanInfo, setKelurahanInfo] = useState<KelurahanInfo | null>(null);
  const [statsData, setStatsData] = useState<StatItem[]>([]);
  const [recentGaleri, setRecentGaleri] = useState<GaleriItem[]>([]);
  const [upcomingAgenda, setUpcomingAgenda] = useState<Agenda[]>([]);
  const [latestBerita, setLatestBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk menyimpan Agenda yang sedang dipilih & Modal Detail
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [info, stats, galeri, agenda, berita] = await Promise.all([
        dataService.getKelurahanInfo(),
        dataService.getStatsData(),
        dataService.getGaleriList(),
        dataService.getUpcomingAgenda(),
        dataService.getBeritaList(),
      ]);
      setKelurahanInfo(info);
      setStatsData(stats);
      setRecentGaleri(galeri.slice(0, 4));
      setUpcomingAgenda(agenda.slice(0, 3));
      setLatestBerita(berita.slice(0, 3));
      setLoading(false);
    }
    loadData();
  }, []);

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

  const handleCloseModal = useCallback(() => {
    setSelectedAgenda(null);
  }, []);

  if (loading || !kelurahanInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">Memuat Portal Resmi Kelurahan...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 pb-20 border-b border-slate-200">
        <div className="absolute inset-0 z-0">
          <img
            src={kantorlurah}
            alt="Kantor Kelurahan Borimasunggu"
            className="w-full h-full object-cover object-center scale-105 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/60" />
          <div className="absolute inset-0 bg-[radial-gradient(#rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-md text-blue-200 text-xs md:text-sm font-semibold tracking-wide">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Portal Resmi Pemerintah Kelurahan</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Kelurahan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-sky-300">
                Borimasunggu
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl">
              Pusat transparansi informasi, tata kelola pemerintahan, dan integrasi layanan publik terpadu untuk kesejahteraan warga.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <Link
                to="/layanan"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-600/30"
              >
                <span>Layanan Publik</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/kontak"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 text-blue-300" />
                <span>Pengaduan Warga</span>
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Layanan Cepat & Transparan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Integrasi Data Kependudukan</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Statistik / Infografis Data */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                Satu Data Borimasunggu
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
                Wilayah & Kependudukan dalam Angka
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-500 max-w-md">
              Data statistik kependudukan dan administratif wilayah Kelurahan Borimasunggu secara real-time dan terverifikasi.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {mergedStats.map((stat, i) => {
              const Icon = getIcon(stat.icon);
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-700 transition-colors">
                      {stat.label}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-700 shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                      {stat.value}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Profil Singkat & Peta */}
      <section className="py-16 bg-slate-50/50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100/80 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Selayang Pandang</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                Mengenal Lebih Dekat Kelurahan Borimasunggu
              </h2>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                {kelurahanInfo.sejarah}
              </p>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-400 font-medium block mb-0.5">Kecamatan</span>
                  <span className="font-bold text-slate-900 text-sm md:text-base">{kelurahanInfo.kecamatan}</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-400 font-medium block mb-0.5">Kabupaten</span>
                  <span className="font-bold text-slate-900 text-sm md:text-base">{kelurahanInfo.kabupaten}</span>
                </div>
              </div>

              <div>
                <Link
                  to="/profil"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-sm"
                >
                  <span>Baca Profil Lengkap</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6"
            >
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm relative">
                <div className="flex items-center justify-between pb-3 px-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Lokasi Kantor Kelurahan</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Google Maps</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-100 aspect-[16/10]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.886239049808!2d119.51715200000001!3d-4.789558999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe4e98b7114b75%3A0x14d9bee274fb570f!2sKantor%20Lurah%20Borimasunggu!5e0!3m2!1sid!2sid!4v1783755004799!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Lokasi Kantor Lurah Borimasunggu"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Berita & Agenda */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Berita Utama (8 Columns) */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Newspaper className="w-6 h-6 text-blue-700" />
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                    Berita
                  </h2>
                </div>
                <Link
                  to="/berita"
                  className="text-xs md:text-sm font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 group"
                >
                  <span>Berita lainnya</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid gap-6">
                {latestBerita.map((berita, i) => (
                  <motion.article
                    key={berita.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={`/berita/${berita.slug || berita.id}`}
                      className="group bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all duration-300"
                    >
                      <div className="sm:w-52 h-48 sm:h-auto shrink-0 overflow-hidden relative">
                        <img
                          src={berita.gambar}
                          alt={berita.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
                              {berita.kategori}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatDateShort(berita.tanggal)}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base md:text-lg group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                            {berita.judul}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                            {berita.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span>Penulis: <strong className="text-slate-700">{berita.penulis}</strong></span>
                          <span className="text-blue-700 font-semibold group-hover:underline flex items-center gap-1">
                            Selengkapnya <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Agenda Kegiatan (4 Columns) */}
            <div className="lg:col-span-4">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="w-6 h-6 text-blue-700" />
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                    Agenda Kegiatan
                  </h2>
                </div>
                <Link
                  to="/agenda"
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-0.5"
                >
                  <span>Semua</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingAgenda.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">Tidak ada agenda mendatang</p>
                    <p className="text-[11px] text-slate-400 mt-1">Jadwal kegiatan terbaru akan ditampilkan di sini.</p>
                  </div>
                ) : (
                  upcomingAgenda.map((agenda, i) => (
                    <motion.div
                      key={agenda.id}
                      initial={{ opacity: 0, x: 15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setSelectedAgenda(agenda)}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex gap-3.5 items-start hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                    >
                      {/* Date Box */}
                      <div className="shrink-0 w-12 h-14 rounded-lg bg-blue-700 group-hover:bg-blue-800 text-white flex flex-col items-center justify-center text-center shadow-xs transition-colors">
                        <span className="text-lg font-black leading-none">{new Date(agenda.tanggal).getDate()}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">
                          {new Date(agenda.tanggal).toLocaleDateString('id-ID', { month: 'short' })}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                          {agenda.kategori}
                        </span>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-700 text-xs md:text-sm mt-1 line-clamp-1 transition-colors">
                          {agenda.judul}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                          <p className="line-clamp-1">📍 {agenda.lokasi}</p>
                          <p className="text-slate-400">🕒 {agenda.waktu}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section Galeri Dokumentasi */}
      <section className="py-16 bg-slate-50/50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-slate-200 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                Dokumentasi Lapangan
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-blue-700" />
                Galeri Kegiatan Warga
              </h2>
            </div>
            <Link
              to="/galeri"
              className="text-xs md:text-sm font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Lihat Foto Lainnya</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {recentGaleri.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <img
                  src={item.gambar}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                    {item.kategori}
                  </span>
                  <h3 className="text-white text-xs md:text-sm font-bold line-clamp-2 mt-0.5">
                    {item.judul}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA / Pengaduan & Aspirasi */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 p-8 sm:p-10 md:p-12 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Sistem Aspirasi & Pengaduan Warga (LAPAN)</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  Punya Keluhan, Saran, atau Pertanyaan?
                </h2>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                  Sampaikan laporan dan masukan Anda secara langsung kepada pihak kelurahan. Laporan Anda diproses secara cepat, transparan, dan terukur.
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span>Respon Cepat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Kerahasiaan Terjamin</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <Link
                  to="/kontak"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Buat Laporan / Pengaduan</span>
                </Link>
                <Link
                  to="/layanan"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 active:scale-95 text-white font-semibold text-sm transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-slate-300" />
                  <span>Prosedur Layanan</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Detail Agenda */}
      <Modal
        isOpen={!!selectedAgenda}
        onClose={handleCloseModal}
        maxWidth="max-w-2xl"
      >
        {selectedAgenda && (
          <div className="p-6 md:p-8 space-y-6">
            {/* Header Modal Agenda */}
            <div className="space-y-3 pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider border border-blue-200">
                  {selectedAgenda.kategori}
                </span>
                {selectedAgenda.status && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold capitalize border border-emerald-200">
                    {selectedAgenda.status}
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                {selectedAgenda.judul}
              </h3>
            </div>

            {/* Grid Detail Meta Informasi Agenda */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-700 shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Tanggal</span>
                  <p className="text-sm font-semibold text-slate-800">{formatDate(selectedAgenda.tanggal)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-700 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Waktu</span>
                  <p className="text-sm font-semibold text-slate-800">{selectedAgenda.waktu}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-red-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Lokasi Pelaksanaan</span>
                  <p className="text-sm font-semibold text-slate-800">{selectedAgenda.lokasi}</p>
                </div>
              </div>
            </div>

            {/* Deskripsi Agenda */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Deskripsi & Rincian Kegiatan</span>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-white rounded-xl p-1">
                {selectedAgenda.deskripsi || 'Tidak ada deskripsi rinci untuk agenda ini.'}
              </div>
            </div>

            {/* Footer Modal Action */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default memo(Beranda);