import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, CalendarDays, Images, Mail, ArrowRight } from 'lucide-react';
import { adminService } from '../../services/Adminservice';
import { supabase } from '../../lib/supabaseClient';
import { formatDate } from '../../lib/format';

interface PesanKontak {
  id: string;
  nama: string;
  subjek: string;
  pesan: string;
  status: 'baru' | 'dibaca' | 'ditindaklanjuti';
  created_at: string;
}

function Dashboard() {
  const [counts, setCounts] = useState({ berita: 0, agenda: 0, galeri: 0, pesanBaru: 0 });
  const [pesanTerbaru, setPesanTerbaru] = useState<PesanKontak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const [berita, galeri, pesanBaru, agendaMendatang, pesan] = await Promise.all([
        adminService.count('berita'),
        adminService.count('galeri'),
        adminService.count('pesan_kontak', { column: 'status', value: 'baru' }),
        supabase.from('agenda').select('*', { count: 'exact', head: true }).gte('tanggal', new Date().toISOString()),
        supabase.from('pesan_kontak').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setCounts({
        berita,
        agenda: agendaMendatang.count ?? 0,
        galeri,
        pesanBaru,
      });
      setPesanTerbaru((pesan.data as PesanKontak[]) ?? []);
      setLoading(false);
    }
    loadData();
  }, []);

  const statCards = [
    { label: 'Total Berita', value: counts.berita, icon: Newspaper, color: 'from-primary-500 to-primary-700', to: '/admin/berita' },
    { label: 'Agenda Mendatang', value: counts.agenda, icon: CalendarDays, color: 'from-secondary-500 to-secondary-700', to: '/admin/agenda' },
    { label: 'Total Galeri', value: counts.galeri, icon: Images, color: 'from-accent-500 to-accent-700', to: '/admin/galeri' },
    { label: 'Pesan Belum Dibaca', value: counts.pesanBaru, icon: Mail, color: 'from-red-500 to-red-700', to: '/admin/pesan-kontak' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 dark:text-slate-400">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Dashboard</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Ringkasan aktivitas website</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={stat.to} className="card card-hover p-5 block">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-5.5 h-5.5 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 dark:text-white">Pesan Kontak Terbaru</h2>
          <Link to="/admin/pesan-kontak" className="text-sm text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1">
            Lihat semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pesanTerbaru.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada pesan masuk.</p>
        ) : (
          <div className="space-y-3">
            {pesanTerbaru.map((p) => (
              <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{p.nama}</span>
                    {p.status === 'baru' && (
                      <span className="badge bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 shrink-0">Baru</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{p.subjek}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{formatDate(p.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;