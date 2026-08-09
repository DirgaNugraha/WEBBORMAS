import { useState, useEffect, useCallback } from 'react';
import { 
  Mail, MailOpen, Send, Phone, MessageSquare, 
  Calendar, Check, User, Sparkles, Inbox 
} from 'lucide-react';
import Modal from '../../components/Modal';
import { supabase } from '../../lib/supabaseClient';
import { formatDate, buildWaLink } from '../../lib/format';
import type { PesanKontak } from '../../types';

const statusConfig = {
  baru: { 
    label: 'Baru', 
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/60',
    iconColor: 'text-rose-500'
  },
  dibaca: { 
    label: 'Dibaca', 
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
    iconColor: 'text-amber-500'
  },
  ditindaklanjuti: { 
    label: 'Ditindaklanjuti', 
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    iconColor: 'text-emerald-500'
  },
  selesai: { 
    label: 'Selesai', 
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/60',
    iconColor: 'text-sky-500'
  },
};

function PesanKontakAdmin() {
  const [list, setList] = useState<PesanKontak[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PesanKontak | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pesan_kontak')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setList((data as PesanKontak[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpen = async (item: PesanKontak) => {
    setSelected(item);
    if (item.status === 'baru') {
      const { error } = await supabase
        .from('pesan_kontak')
        .update({ status: 'dibaca' })
        .eq('id', item.id);
      if (error) {
        console.error('Gagal menandai pesan sebagai dibaca:', error.message);
        return;
      }
      setSelected({ ...item, status: 'dibaca' });
      loadData();
    }
  };

  const handleUpdateStatus = async (statusTarget: 'ditindaklanjuti' | 'selesai') => {
    if (!selected) return;
    const { error } = await supabase
      .from('pesan_kontak')
      .update({ status: statusTarget })
      .eq('id', selected.id);
    if (error) {
      console.error('Gagal memperbarui status pesan:', error.message);
      return;
    }
    setSelected({ ...selected, status: statusTarget });
    loadData();
  };

  const handleBalasWhatsApp = async () => {
    if (!selected) return;

    // 1. Bangun URL WhatsApp
    const waUrl = buildWaLink(selected.telepon, selected.nama, selected.subjek);

    // 2. Buka tab baru
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // 3. Update status jika belum ditindaklanjuti / selesai
    if (selected.status === 'baru' || selected.status === 'dibaca') {
      await handleUpdateStatus('ditindaklanjuti');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pesan & Pengaduan</h1>
            {list.filter(i => i.status === 'baru').length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-pulse">
                {list.filter(i => i.status === 'baru').length} Baru
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Daftar laporan dan aspirasi masyarakat yang masuk melalui portal kelurahan.
          </p>
        </div>
      </div>

      {/* LIST TABLE/CARD CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium text-slate-500">Memuat pesan pengaduan...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Belum Ada Pesan Masuk</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Kotak masuk pengaduan warga saat ini masih kosong.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {list.map((item) => {
              const config = statusConfig[item.status] || statusConfig.baru;
              const isUnread = item.status === 'baru';

              return (
                <button
                  key={item.id}
                  onClick={() => handleOpen(item)}
                  className={`w-full text-left p-4 sm:p-5 transition-all flex items-start gap-4 relative group hover:bg-slate-50/80 cursor-pointer ${
                    isUnread ? 'bg-rose-50/30' : ''
                  }`}
                >
                  {/* Indikator Aksen Garis Kiri untuk Pesan Baru */}
                  {isUnread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-r-full" />
                  )}

                  {/* Icon Status */}
                  <div className={`mt-1 p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${
                    isUnread ? 'bg-rose-100/80 text-rose-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isUnread ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <MailOpen className="w-4 h-4" />
                    )}
                  </div>

                  {/* Content Preview */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-bold truncate ${
                          isUnread ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {item.nama}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.badgeClass}`}>
                          {config.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <p className={`text-xs sm:text-sm truncate ${
                      isUnread ? 'font-bold text-slate-800' : 'text-slate-600'
                    }`}>
                      {item.subjek}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {item.telepon}
                      </span>
                      <p className="truncate text-slate-400 max-w-md hidden sm:block">
                        {item.pesan}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <Modal isOpen={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                    statusConfig[selected.status]?.badgeClass
                  }`}>
                    {statusConfig[selected.status]?.label}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDate(selected.created_at)}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {selected.subjek}
                </h2>
              </div>
            </div>

            {/* Informasi Pengirim */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-lg border border-slate-200/80 text-slate-500 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Pengirim</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{selected.nama}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200/80 text-emerald-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">WhatsApp</p>
                  <p className="text-xs font-bold text-emerald-800 truncate">{selected.telepon}</p>
                </div>
              </div>
            </div>

            {/* Isi Pesan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Isi Pesan / Pengaduan:</span>
              </label>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selected.pesan}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              {/* Tombol Utama WhatsApp */}
              <button 
                onClick={handleBalasWhatsApp} 
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Balas Pesan via WhatsApp</span>
              </button>

              {/* Status Update Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {selected.status !== 'ditindaklanjuti' && selected.status !== 'selesai' && (
                  <button 
                    onClick={() => handleUpdateStatus('ditindaklanjuti')} 
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ditindaklanjuti</span>
                  </button>
                )}

                {selected.status !== 'selesai' && (
                  <button 
                    onClick={() => handleUpdateStatus('selesai')} 
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200/60 transition-colors cursor-pointer col-span-2 sm:col-span-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Tandai Selesai</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default PesanKontakAdmin;