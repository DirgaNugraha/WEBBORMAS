import { useState, useEffect, useCallback } from 'react';
import { Mail, MailOpen, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/Modal';
import { supabase } from '../../lib/supabaseClient';
import { formatDate } from '../../lib/format';

interface PesanKontak {
  id: string;
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
  status: 'baru' | 'dibaca' | 'ditindaklanjuti';
  created_at: string;
}

const statusConfig = {
  baru: { label: 'Baru', className: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' },
  dibaca: { label: 'Dibaca', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400' },
  ditindaklanjuti: { label: 'Ditindaklanjuti', className: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' },
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
      await supabase.from('pesan_kontak').update({ status: 'dibaca' }).eq('id', item.id);
      loadData();
    }
  };

  const handleTindakLanjut = async () => {
    if (!selected) return;
    await supabase.from('pesan_kontak').update({ status: 'ditindaklanjuti' }).eq('id', selected.id);
    setSelected({ ...selected, status: 'ditindaklanjuti' });
    loadData();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Pesan Kontak</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Pesan masuk dari formulir kontak website</p>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-slate-500 dark:text-slate-400">Memuat pesan...</p>
        ) : list.length === 0 ? (
          <p className="p-6 text-center text-slate-500 dark:text-slate-400">Belum ada pesan masuk.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((item) => (
              <button
                key={item.id}
                onClick={() => handleOpen(item)}
                className="w-full flex items-start gap-4 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="mt-0.5 shrink-0">
                  {item.status === 'baru' ? (
                    <Mail className="w-5 h-5 text-red-500" />
                  ) : (
                    <MailOpen className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-semibold text-sm ${item.status === 'baru' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {item.nama}
                    </span>
                    <span className={`badge ${statusConfig[item.status].className}`}>
                      {statusConfig[item.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{item.subjek}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{formatDate(item.created_at)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className={`badge ${statusConfig[selected.status].className}`}>
                {statusConfig[selected.status].label}
              </span>
              <span className="text-xs text-slate-400">{formatDate(selected.created_at)}</span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{selected.subjek}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Dari: <span className="font-medium">{selected.nama}</span> ({selected.email})
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-6">
              {selected.pesan}
            </div>

            {selected.status !== 'ditindaklanjuti' && (
              <button onClick={handleTindakLanjut} className="btn-primary w-full">
                <CheckCircle2 className="w-4 h-4" /> Tandai Ditindaklanjuti
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default PesanKontakAdmin;