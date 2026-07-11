import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Building2, MessageSquare } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { dataService } from '../services/dataService';

interface ContactForm {
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
}

const initialForm: ContactForm = { nama: '', email: '', subjek: '', pesan: '' };

function Kontak() {
  const kelurahanInfo = dataService.getKelurahanInfo();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ContactForm>(initialForm);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm(initialForm);
    setTimeout(() => setSubmitted(false), 5000);
  }, []);

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

              {/* Map placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-64 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center"
              >
                <div className="text-center">
                  <Building2 className="w-12 h-12 text-primary-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Peta Lokasi Kelurahan</p>
                  <p className="text-xs text-slate-400 mt-1">{kelurahanInfo.alamat}</p>
                </div>
              </motion.div>
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
                <button type="submit" className="btn-primary w-full">
                  Kirim Pesan
                  <Send className="w-4 h-4" />
                </button>
              </form>

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
