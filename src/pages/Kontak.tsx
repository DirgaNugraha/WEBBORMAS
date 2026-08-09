import { memo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Building2,
  HelpCircle,
  Loader2
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { dataService } from '../services/dataService';
import { supabase } from '../lib/supabaseClient';
import { sanitizeWaNumber, validateWaNumber } from '../lib/format';
import { pesanKontakInputSchema } from '../types/schemas';
import type { KelurahanInfo } from '../types';

interface ContactForm {
  nama: string;
  telepon: string;
  subjek: string;
  pesan: string;
}

const initialForm: ContactForm = { nama: '', telepon: '', subjek: '', pesan: '' };

function Kontak() {
  const [kelurahanInfo, setKelurahanInfo] = useState<KelurahanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState<ContactForm>(initialForm);

  useEffect(() => {
    dataService.getKelurahanInfo().then((data) => {
      setKelurahanInfo(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSubmitError('');

    // Validasi sisi-klien sebagai lapisan keamanan dasar:
    // hindari spam field kosong dan batasi panjang input.
    const nama = form.nama.trim();
    const telepon = form.telepon.trim();
    const subjek = form.subjek.trim();
    const pesan = form.pesan.trim();

    if (!nama || !telepon || !subjek || !pesan) {
      setSending(false);
      setSubmitError('Mohon lengkapi semua kolom pada formulir.');
      return;
    }
    if (nama.length > 120 || subjek.length > 200 || pesan.length > 5000) {
      setSending(false);
      setSubmitError('Terdapat isian yang melebihi batas panjang karakter. Mohon periksa kembali.');
      return;
    }
    if (!validateWaNumber(telepon)) {
      setSending(false);
      setSubmitError('Nomor WhatsApp tidak valid. Pastikan hanya berisi angka dengan minimal 10 digit.');
      return;
    }

// Sanitasi nomor WA ke format internasional Indonesia (contoh: 08xx -> 628xx)
    const teleponTersanitasi = sanitizeWaNumber(telepon);

    // Validasi tambahan dengan zod (schema) sebelum dikirim ke server
    const parsed = pesanKontakInputSchema.safeParse({
      nama,
      telepon: teleponTersanitasi,
      subjek,
      pesan,
    });

    if (!parsed.success) {
      setSending(false);
      setSubmitError(
        parsed.error.issues[0]?.message || 'Terdapat isian yang tidak valid.'
      );
      return;
    }

    const { data: payload } = parsed;

    const { error } = await supabase.from('pesan_kontak').insert({
      nama: payload.nama,
      telepon: payload.telepon,
      subjek: payload.subjek,
      pesan: payload.pesan,
      status: 'baru',
    });

    setSending(false);

    if (error) {
      setSubmitError('Gagal mengirim pesan. Silakan periksa koneksi internet Anda dan coba lagi.');
      console.error('Gagal insert pesan_kontak:', error.message);
      return;
    }

    setSubmitted(true);
    setForm(initialForm);
    setTimeout(() => setSubmitted(false), 6000);
  }, [form]);

  if (loading || !kelurahanInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">Memuat Pusat Layanan Kontak...</p>
      </div>
    );
  }

  const contactItems = [
    { 
      icon: MapPin, 
      label: 'Alamat Kantor Lurah', 
      value: kelurahanInfo.alamat, 
      badge: 'Lokasi Pelayanan',
      iconColor: 'text-blue-700 bg-blue-50 border-blue-100'
    },
    { 
      icon: Phone, 
      label: 'Kontak', 
      value: kelurahanInfo.telepon, 
      badge: 'Respon Cepat',
      iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-100'
    },
    { 
      icon: Mail, 
      label: 'Email', 
      value: kelurahanInfo.email, 
      badge: 'Surat-menyurat',
      iconColor: 'text-indigo-700 bg-indigo-50 border-indigo-100'
    },
    { 
      icon: Clock, 
      label: 'Jam Operasional Kantor', 
      value: kelurahanInfo.jamLayanan, 
      badge: 'Hari Kerja',
      iconColor: 'text-amber-700 bg-amber-50 border-amber-100'
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased selection:bg-blue-600 selection:text-white pb-20">
      {/* Header Halaman */}
      <PageHeader
        title="Layanan Kontak & Pengaduan"
        subtitle="Hubungi kami untuk pertanyaan administrasi, permohonan informasi publik, atau pengaduan aspirasi warga Kelurahan Borimasunggu."
        icon={<Building2 className="w-8 h-8 text-blue-700" />}
      />

      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Kolom Kiri: Informasi Kontak & Peta (5 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                Informasi Resmi
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
                Pusat Informasi & Lokasi
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Kunjungi kantor kami pada jam operasional atau hubungi melalui saluran komunikasi resmi berikut.
              </p>
            </div>

            {/* List Kartu Kontak */}
            <div className="space-y-3.5">
              {contactItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className={`p-3 rounded-xl border shrink-0 ${item.iconColor}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {item.label}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-sm md:text-base font-bold text-slate-900 leading-snug break-words">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Peta Google Maps Embed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Peta Wilayah Kantor Lurah
                </span>
                <a
                  href="https://maps.google.com/?q=Kantor+Lurah+Borimasunggu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 hover:underline"
                >
                  <span>Buka App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-100 aspect-[16/9]">
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
            </motion.div>
          </motion.div>

          {/* Kolom Kanan: Formulir Pengaduan / Aspirasi (7 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 shadow-xs relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-xs shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  Formulir Aspirasi & Pesan Warga
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                  Sampaikan laporan, kendala layanan, atau pertanyaan Anda secara resmi.
                </p>
              </div>
            </div>

            {/* Form Input */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Contoh: Andi Muhammad"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Contoh: 081234567890"
                    pattern="[0-9+\-\s]+"
                    value={form.telepon}
                    onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Subjek Pesan / Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.subjek}
                  onChange={(e) => setForm({ ...form, subjek: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Contoh: Permohonan Info Surat Keterangan Domisili"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Detail Pesan / Aspirasi <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.pesan}
                  onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none placeholder:text-slate-400"
                  placeholder="Tuliskan secara lengkap rincian pertanyaan, usulan, atau laporan Anda di sini..."
                />
              </div>

              {/* Guarantees Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Setiap laporan pesan yang masuk akan diverifikasi oleh petugas kelurahan pada hari kerja operasional.</span>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-700/20 disabled:opacity-60 cursor-pointer"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sedang Mengirim Pesan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan Resmi</span>
                  </>
                )}
              </button>
            </form>

            {/* Alert Error */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs md:text-sm font-semibold flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{submitError}</span>
              </motion.div>
            )}

            {/* Alert Success */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs md:text-sm font-semibold flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Pesan dan aspirasi Anda telah berhasil terkirim! Tim kelurahan akan segera menindaklanjuti. Terima kasih.</span>
              </motion.div>
            )}
          </motion.div>

        </div>
      </section>
    </div>
  );
}

export default memo(Kontak);