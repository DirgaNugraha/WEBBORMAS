import { memo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { dataService } from '../services/dataService';
import { supabase } from '../lib/supabaseClient';
import type { KelurahanInfo } from '../types';

interface ContactForm {
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
}

const initialForm: ContactForm = { nama: '', email: '', subjek: '', pesan: '' };

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

    const { error } = await supabase.from('pesan_kontak').insert({
      nama: form.nama,
      email: form.email,
      subjek: form.subjek,
      pesan: form.pesan,
    });

    setSending(false);

    if (error) {
      setSubmitError('Gagal mengirim pesan. Silakan coba lagi.');
      console.error('Gagal insert pesan_kontak:', error.message);
      return;
    }

    setSubmitted(true);
    setForm(initialForm);
    setTimeout(() => setSubmitted(false), 5000);
  }, [form]);

  if (loading || !kelurahanInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Memuat halaman kontak...</p>
      </div>
    );
  }

  const contactItems = [
    { icon: MapPin, label: 'Alamat', value: kelurahanInfo.alamat, color: 'from-primary-500 to-primary-700' },
    { icon: Phone, label: 'Telepon', value: kelurahanInfo.telepon, color: 'from-secondary-500 to-secondary-700' },
    { icon: Mail, label: 'Email', value: kelurahanInfo.email, color: 'from-accent-500 to-accent-700' },
    { icon: Clock, label: 'Jam Layanan', value: kelurahanInfo.jamLayanan, color: 'from-primary-500 to-secondary-600' },
  ];

  return (
    <div>
      <PageHeader
        title="Kontak"
        subtitle="Hubungi kami untuk pertanyaan, aspirasi, atau pelayanan administrasi Kelurahan Borimasunggu."
        icon={<MapPin className="w-8 h-8 text-white" />}
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Informasi Kontak
              </h2>
              <div className="space-y-4">
                {contactItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="card p-5 flex gap-4"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{item.label}</div>
                      <div className="font-semibold text-slate-900 dark:text-white">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

                {/* Google Maps */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="mt-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg"
>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.886239049808!2d119.51715200000001!3d-4.789558999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe4e98b7114b75%3A0x14d9bee274fb570f!2sKantor%20Lurah%20Borimasunggu!5e0!3m2!1sid!2sid!4v1783755004799!5m2!1sid!2sid"
    width="100%"
    height="256"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="strict-origin-when-cross-origin"
    title="Lokasi Kantor Lurah Borimasunggu"
    className="w-full"
  />
</motion.div>
<div className="mt-3 text-right">
  <a
    href="https://maps.google.com/?q=Kantor+Lurah+Borimasunggu"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm font-medium text-primary-600 hover:text-primary-700"
  >
    Buka di Google Maps →
  </a>
</div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kirim Pesan</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Sampaikan pertanyaan atau aspirasi Anda.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="input-field"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subjek</label>
                  <input
                    type="text"
                    required
                    value={form.subjek}
                    onChange={(e) => setForm({ ...form, subjek: e.target.value })}
                    className="input-field"
                    placeholder="Subjek pesan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pesan</label>
                  <textarea
                    required
                    rows={5}
                    value={form.pesan}
                    onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                  {sending ? 'Mengirim...' : 'Kirim Pesan'}
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium"
                >
                  {submitError}
                </motion.div>
              )}

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-secondary-50 dark:bg-secondary-950/40 border border-secondary-200 dark:border-secondary-800 text-secondary-700 dark:text-secondary-400 text-sm font-medium"
                >
                  Pesan Anda telah terkirim. Kami akan segera menanggapi. Terima kasih!
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default memo(Kontak);