import React, { memo, useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { dataService } from '../services/dataService';
import { getDayNumber, getMonthShort } from '../lib/format';
import type { AgendaFilter, Agenda as AgendaType } from '../types';

const filterOptions: { key: AgendaFilter; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'upcoming', label: 'Akan Datang' },
  { key: 'selesai', label: 'Selesai' },
];

type StatusContent = {
  label: string;
  icon: React.ReactNode;
  className: string;
  textClassName: string;
};

function getStatusContent(status: AgendaType['status']): StatusContent {
  if (status === 'upcoming') {
    return {
      label: 'Akan Datang',
      icon: <CalendarCheck className="w-4 h-4" aria-hidden="true" />,
      className:
        'bg-primary-600/10 text-primary-700 dark:bg-primary-400/10 dark:text-primary-300 border border-primary-600/20 dark:border-primary-400/20',
      textClassName: 'text-primary-700 dark:text-primary-300',
    };
  }

  return {
    label: 'Selesai',
    icon: <CheckCircle2 className="w-4 h-4" aria-hidden="true" />,
    className:
      'bg-slate-200/70 text-slate-700 dark:bg-slate-800/70 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70',
    textClassName: 'text-slate-700 dark:text-slate-300',
  };
}

function AgendaSkeletonCard({ index }: { index: number }) {
  return (
    <div className="relative">
      {/* Mobile card */}
      <div className="md:hidden">
        <article className="card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="min-w-0">
                <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-28 animate-pulse" />
                <div className="mt-2 h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-20 animate-pulse" />
              </div>
            </div>
            <div className="h-9 w-24 sm:w-28 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>

          <div className="mt-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-[70%] animate-pulse" />
            <div className="mt-3 h-3 bg-slate-200 dark:bg-slate-800 rounded w-[95%] animate-pulse" />
            <div className="mt-2 h-3 bg-slate-200 dark:bg-slate-800 rounded w-[80%] animate-pulse" />
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          </div>

          <div
            className="absolute inset-0 rounded-2xl ring-1 ring-transparent hover:ring-primary-500/20"
            aria-hidden="true"
          />
        </article>
      </div>

      {/* Desktop timeline item */}
      <div className="hidden md:block">
        <div className="relative flex gap-6">
          <div className="relative z-10 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>

          <div className="card card-hover p-5 flex-1">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="h-7 w-36 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-7 w-28 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-[60%] animate-pulse" />
            <div className="mt-3 h-4 bg-slate-200 dark:bg-slate-800 rounded w-[90%] animate-pulse" />
            <div className="mt-2 h-4 bg-slate-200 dark:bg-slate-800 rounded w-[75%] animate-pulse" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* subtle stagger */}
      <div className="sr-only">{index}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary-600/10 border border-primary-600/20 flex items-center justify-center dark:bg-primary-400/10 dark:border-primary-400/20">
          <CalendarDays className="w-6 h-6 text-primary-700 dark:text-primary-300" aria-hidden="true" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          Tidak ada agenda
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Saat ini belum tersedia agenda pada kategori yang kamu pilih.
        </p>
      </div>
    </div>
  );
}

function Agenda() {
  const [filter, setFilter] = useState<AgendaFilter>('all');
  const [allAgenda, setAllAgenda] = useState<AgendaType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    dataService.getAgendaList().then((data) => {
      if (!mounted) return;
      setAllAgenda(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(
    () => allAgenda.filter((a) => filter === 'all' || a.status === filter),
    [allAgenda, filter]
  );

  return (
    <div className="relative overflow-x-hidden w-full">
      <PageHeader
        title="Agenda"
        subtitle="Jadwal kegiatan dan acara yang akan dan telah dilaksanakan di Kelurahan Borimasunggu."
        icon={<CalendarDays className="w-8 h-8 text-white" />}
      />

      <section>
        <div className="container-page pt-10 sm:pt-14 pb-16 sm:pb-24">
          {/* Filter */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14"
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
                  className={
                    active
                      ? 'px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white shadow-lg shadow-primary-600/20 border border-primary-600/20'
                      : 'px-5 sm:px-6 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700/70 transition-all'
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4 md:space-y-6">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <AgendaSkeletonCard key={idx} index={idx} />
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {/* Mobile stack */}
              <div className="md:hidden">
                <div className="space-y-4">
                  {filtered.map((agenda, i) => {
                    const status = getStatusContent(agenda.status);

                    return (
                      <motion.article
                        key={agenda.id}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.35 }}
                        className="card card-hover p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={
                                'w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg ' +
                                (agenda.status === 'upcoming'
                                  ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                                  : 'bg-gradient-to-br from-slate-400 to-slate-600')
                              }
                              aria-label={
                                agenda.status === 'upcoming'
                                  ? `Agenda akan datang pada ${agenda.tanggal}`
                                  : `Agenda selesai pada ${agenda.tanggal}`
                              }
                            >
                              <span className="text-lg font-bold leading-none">{getDayNumber(agenda.tanggal)}</span>
                              <span className="text-[10px] uppercase -mt-0.5">{getMonthShort(agenda.tanggal)}</span>
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2">
                                {agenda.judul}
                              </h3>
                              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                {agenda.deskripsi}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300">
                            {agenda.kategori}
                          </span>

                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                            {status.icon}
                            <span className="whitespace-nowrap">{status.label}</span>
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-2">
                            <Clock className="w-4 h-4" aria-hidden="true" />
                            <span className="font-medium text-slate-700 dark:text-slate-200">{agenda.waktu}</span>
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="w-4 h-4" aria-hidden="true" />
                            <span className="font-medium text-slate-700 dark:text-slate-200">{agenda.lokasi}</span>
                          </span>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>

              {/* Desktop timeline */}
              <div className="hidden md:block relative max-w-3xl mx-auto">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true" />

                <div className="space-y-6">
                  {filtered.map((agenda, i) => {
                    const status = getStatusContent(agenda.status);

                    return (
                      <motion.article
                        key={agenda.id}
                        initial={{ opacity: 0, x: -18 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.35 }}
                        className="relative flex gap-6"
                      >
                        <div className="relative z-10 shrink-0">
                          <div
                            className={
                              'w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg ' +
                              (agenda.status === 'upcoming'
                                ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                                : 'bg-gradient-to-br from-slate-400 to-slate-600')
                            }
                          >
                            <span className="text-xl font-bold leading-none">{getDayNumber(agenda.tanggal)}</span>
                            <span className="text-[10px] uppercase mt-0.5">{getMonthShort(agenda.tanggal)}</span>
                          </div>
                        </div>

                        <div className="card card-hover p-5 flex-1">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <span className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300">
                              {agenda.kategori}
                            </span>

                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                              {status.icon}
                              <span className="whitespace-nowrap">{status.label}</span>
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg leading-snug line-clamp-2">
                            {agenda.judul}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            {agenda.deskripsi}
                          </p>

                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
                            <span className="inline-flex items-center gap-2">
                              <Clock className="w-4 h-4" aria-hidden="true" />
                              <span className="font-medium text-slate-700 dark:text-slate-200">{agenda.waktu}</span>
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="w-4 h-4" aria-hidden="true" />
                              <span className="font-medium text-slate-700 dark:text-slate-200">{agenda.lokasi}</span>
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>

              {filtered.length === 0 && <EmptyState />}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default memo(Agenda);