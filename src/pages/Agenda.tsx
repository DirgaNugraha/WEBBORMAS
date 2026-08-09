import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  FileText,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { dataService } from '../services/dataService';
import { getDayNumber, getMonthShort, formatDate } from '../lib/format';
import Modal from '../components/Modal';
import type { AgendaFilter, Agenda as AgendaType } from '../types';

const filterOptions: { key: AgendaFilter; label: string }[] = [
  { key: 'all', label: 'Semua Agenda' },
  { key: 'upcoming', label: 'Akan Datang' },
  { key: 'selesai', label: 'Telah Selesai' },
];

type StatusContent = {
  label: string;
  icon: React.ReactNode;
  badgeStyle: string;
};

function getStatusContent(status: AgendaType['status']): StatusContent {
  if (status === 'upcoming') {
    return {
      label: 'Akan Datang',
      icon: <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />,
      badgeStyle: 'bg-blue-50 text-blue-700 border border-blue-200',
    };
  }

  return {
    label: 'Selesai',
    icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
    badgeStyle: 'bg-slate-100 text-slate-600 border border-slate-200',
  };
}

function AgendaSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs animate-pulse flex flex-col md:flex-row gap-5">
      <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-6 bg-slate-200 rounded-full w-24" />
        </div>
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="pt-2 flex gap-4">
          <div className="h-4 bg-slate-200 rounded w-28" />
          <div className="h-4 bg-slate-200 rounded w-36" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-4">
        <CalendarDays className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">
        Tidak Ada Agenda
      </h3>
      <p className="mt-1 text-xs md:text-sm text-slate-500 max-w-sm mx-auto">
        Saat ini belum ada jadwal kegiatan pada kategori filter yang Anda pilih.
      </p>
    </div>
  );
}

const PER_PAGE = 10;

function Agenda() {
  const [filter, setFilter] = useState<AgendaFilter>('all');
  const [allAgenda, setAllAgenda] = useState<AgendaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  // State untuk Modal Detail Agenda
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaType | null>(null);

  useEffect(() => {
    let mounted = true;

    dataService.getAgendaPage({ page: 1, perPage: PER_PAGE }).then((result) => {
      if (!mounted) return;
      setAllAgenda(result.data);
      setHasMore(result.hasMore);
      setPage(1);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const result = await dataService.getAgendaPage({ page: nextPage, perPage: PER_PAGE });
    setAllAgenda((prev) => [...prev, ...result.data]);
    setHasMore(result.hasMore);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const filtered = useMemo(
    () => allAgenda.filter((a) => filter === 'all' || a.status === filter),
    [allAgenda, filter]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedAgenda(null);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen antialiased text-slate-800 pb-20">
      {/* Page Header */}
      <PageHeader
        title="Agenda Kelurahan"
        subtitle="Jadwal kegiatan resmi, rapat koordinasi, serta acara kemasyarakatan di Kelurahan Borimasunggu."
        icon={<CalendarDays className="w-8 h-8 text-blue-700" />}
      />

      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Controls Bar & Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                Jadwal & Acara
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
                Daftar Kegiatan
              </h2>
            </div>

            <div
              className="flex items-center gap-1.5 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-200/80 w-full sm:w-auto overflow-x-auto"
              role="group"
              aria-label="Filter agenda"
            >
              {filterOptions.map((f) => {
                const active = filter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    aria-pressed={active}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                      active
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Content */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <AgendaSkeletonCard key={idx} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="relative">
              {/* Timeline Vertical Line (Desktop View) */}
              <div
                className="hidden md:block absolute left-8 top-3 bottom-3 w-0.5 bg-slate-200"
                aria-hidden="true"
              />

              <div className="space-y-5">
                {filtered.map((agenda, i) => {
                  const status = getStatusContent(agenda.status);

                  return (
                    <motion.article
                      key={agenda.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedAgenda(agenda)}
                      className="relative flex flex-col md:flex-row gap-4 md:gap-6 group cursor-pointer"
                    >
                      {/* Date Badge Indicator */}
                      <div className="relative z-10 shrink-0 self-start">
                        <div
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-xs transition-transform group-hover:scale-105 ${
                            agenda.status === 'upcoming'
                              ? 'bg-blue-700'
                              : 'bg-slate-600'
                          }`}
                        >
                          <span className="text-lg md:text-xl leading-none">
                            {getDayNumber(agenda.tanggal)}
                          </span>
                          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider mt-0.5 opacity-90">
                            {getMonthShort(agenda.tanggal)}
                          </span>
                        </div>
                      </div>

                      {/* Details Card */}
                      <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs group-hover:border-blue-400 group-hover:shadow-md transition-all">
                        {/* Header Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/70">
                            <Tag className="w-3 h-3 text-blue-700" />
                            {agenda.kategori}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.badgeStyle}`}
                          >
                            {status.icon}
                            <span>{status.label}</span>
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <h3 className="font-extrabold text-slate-900 text-base md:text-lg leading-snug group-hover:text-blue-700 transition-colors mb-2">
                          {agenda.judul}
                        </h3>

                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                          {agenda.deskripsi}
                        </p>

                        {/* Footer Info (Time & Location) */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-blue-700" />
                            {agenda.waktu}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-blue-700" />
                            {agenda.lokasi}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
</div>
            </div>
          )}

          {/* Tombol Muat Lebih Banyak */}
          {!loading && filtered.length > 0 && hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                {loadingMore ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memuat...
                  </>
                ) : (
                  'Muat Lebih Banyak'
                )}
              </button>
            </div>
          )}
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
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    getStatusContent(selectedAgenda.status).badgeStyle
                  }`}
                >
                  {getStatusContent(selectedAgenda.status).icon}
                  <span>{getStatusContent(selectedAgenda.status).label}</span>
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                {selectedAgenda.judul}
              </h3>
            </div>

            {/* Grid Detail Informasi Agenda */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-700 shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Tanggal
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(selectedAgenda.tanggal)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-700 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Waktu
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedAgenda.waktu}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-red-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Lokasi Pelaksanaan
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedAgenda.lokasi}
                  </p>
                </div>
              </div>
            </div>

            {/* Deskripsi Lengkap Agenda */}
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
                type="button"
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

export default memo(Agenda);