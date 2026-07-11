import { Link } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Send } from 'lucide-react';
import { navItems } from '../data/navigation';
import { kelurahanInfo } from '../data/kelurahanInfo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Kelurahan Borimasunggu</h3>
                <p className="text-xs text-slate-400">Kabupaten Soppeng</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Website resmi Kelurahan Borimasunggu, Kecamatan Marioriwo, Kabupaten Soppeng, Sulawesi Selatan.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                  aria-label="Social media"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2.5">
              {navItems.slice(0, 5).map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Layanan</h4>
            <ul className="space-y-2.5">
              {navItems.slice(5).map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span>{kelurahanInfo.alamat}</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span>{kelurahanInfo.telepon}</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span className="break-all">{kelurahanInfo.email}</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <Clock className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span>{kelurahanInfo.jamLayanan}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold text-white text-base">Berlangganan Informasi</h4>
              <p className="text-sm text-slate-400 mt-1">Dapatkan info terbaru tentang kegiatan kelurahan.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Anda"
                className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1 md:w-64"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-colors flex items-center gap-2 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Kirim</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container-page py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Kelurahan Borimasunggu. Hak cipta dilindungi.
          </p>
          <p className="text-sm text-slate-500">
            Dibuat dengan dedikasi untuk masyarakat Borimasunggu.
          </p>
        </div>
      </div>
    </footer>
  );
}
