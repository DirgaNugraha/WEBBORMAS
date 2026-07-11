import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, MapPin, CheckCircle2, CalendarCheck } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { dataService } from '../services/dataService';
import { getDayNumber, getMonthShort } from '../lib/format';
import type { AgendaFilter } from '../types';

const filterOptions: { key: AgendaFilter; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'upcoming', label: 'Akan Datang' },
  { key: 'selesai', label: 'Selesai' },
];

function Agenda() {
  const [filter, setFilter] = useState<AgendaFilter>('all');

  const allAgenda = useMemo(() => dataService.getAgendaList(), []);
  const filtered = useMemo(
    () => allAgenda.filter((a) => filter === 'all' || a.status === filter),
    [allAgenda, filter]
  );

  return (
    <div>
      <PageHeader
        title="Agenda"
        subtitle="Jadwal kegiatan dan acara yang akan dan telah dilaksanakan di Kelurahan Borimasunggu."
        icon={<CalendarDays className="w-8 h-8 text-white" />}
      />

      <section className="section-padding">
        <div className="container-page">
          {/* Filter */}
          <div className="flex justify-center gap-2 mb-10">
            {filterOptions.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  filter === f.key
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-6">
              {filtered.map((agenda, i) => (
                <motion.div
                  key={agenda.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative flex gap-6"
                >
                  <div className="relative z-10 shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg ${
                        agenda.status === 'upcoming'
                          ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                          : 'bg-gradient-to-br from-slate-400 to-slate-600'
                      }`}
                    >
                      <span className="text-xl font-bold leading-none">{getDayNumber(agenda.tanggal)}</span>
                      <span className="text-[10px] uppercase mt-0.5">{getMonthShort(agenda.tanggal)}</span>
                    </div>
                  </div>
                  <div className="card card-hover p-5 flex-1">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300">
                        {agenda.kategori}
                      </span>
                      {agenda.status === 'upcoming' ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                          <CalendarCheck className="w-3.5 h-3.5" />
                          Akan Datang
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selesai
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">{agenda.judul}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{agenda.deskripsi}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {agenda.waktu}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {agenda.lokasi}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 dark:text-slate-400">Tidak ada agenda pada kategori ini.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default memo(Agenda);
