import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Newspaper, CalendarDays, Images, Mail, ArrowRight, 
  MessageSquare, Phone, Clock, Inbox, Loader2 
} from 'lucide-react';
import { adminService } from '../../services/Adminservice';
import { supabase } from '../../lib/supabaseClient';
import { formatDate } from '../../lib/format';

interface PesanKontak {
  id: string;
  nama: string;
  telepon: string;
  subjek: string;
  pesan: string;
  status: 'baru' | 'dibaca' | 'ditindaklanjuti' | 'selesai';
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
    { 
      label: 'Total Berita', 
      value: counts.berita, 
      icon: Newspaper, 
      color: 'from-blue-600 to-indigo-700', 
      bgLight: 'bg-blue-50 text-blue-700 border-blue-100',
      to: '/admin/berita' 
    },
    { 
      label: 'Agenda Mendatang', 
      value: counts.agenda, 
      icon: CalendarDays, 
      color: 'from-emerald-500 to-teal-700', 
      bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      to: '/admin/agenda' 
    },
    { 
      label: 'Total Galeri', 
      value: counts.galeri, 
      icon: Images, 
      color: 'from-violet-600 to-purple-700', 
      bgLight: 'bg-violet-50 text-violet-700 border-violet-100',
      to: '/admin/galeri' 
    },
    { 
      label: 'Pesan Belum Dibaca', 
      value: counts.pesanBaru, 
      icon: Mail, 
      color: 'from-rose-500 to-red-700', 
      bgLight: 'bg-rose-50 text-rose-700 border-rose-100',
      to: '/admin/pesan-kontak' 
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
        <p className="text-xs font-medium text-slate-500">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Ringkasan</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau statistik konten dan aktivitas pengaduan masyarakat terkini.
          </p>
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link 
                to={stat.to} 
                className="group relative bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 block overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* RECENT CONTACT MESSAGES SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900">Pesan Pengaduan Terbaru</h2>
          </div>
          <Link 
            to="/admin/pesan-kontak" 
            className="text-xs text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
          >
            <span>Lihat semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pesanTerbaru.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium text-slate-500">Belum ada pesan masuk.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pesanTerbaru.map((p) => {
              const isUnread = p.status === 'baru';
              return (
                <div 
                  key={p.id} 
                  className={`py-3.5 px-3 rounded-xl transition-colors flex items-start justify-between gap-4 hover:bg-slate-50/80 ${
                    isUnread ? 'bg-rose-50/30' : ''
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold truncate ${
                        isUnread ? 'text-slate-900' : 'text-slate-700'
                      }`}>
                        {p.nama}
                      </span>
                      
                      {/* Badge WhatsApp */}
                      {p.telepon && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <Phone className="w-2.5 h-2.5 text-emerald-600" />
                          {p.telepon}
                        </span>
                      )}

                      {/* Status Baru Badge */}
                      {isUnread && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                          Baru
                        </span>
                      )}
                    </div>

                    <p className={`text-xs truncate ${
                      isUnread ? 'font-semibold text-slate-800' : 'text-slate-600'
                    }`}>
                      {p.subjek}
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap shrink-0 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-300" />
                    {formatDate(p.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;