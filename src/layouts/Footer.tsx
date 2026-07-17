import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock} from 'lucide-react';
import { navItems } from '../data/navigation';
import { kelurahanInfo } from '../data/kelurahanInfo';
import logoKpKp from '../aset/logopkp.png';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                <img
                  src={logoKpKp}
                  alt="Logo Kelurahan Borimasunggu"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Kelurahan Borimasunggu</h3>
                <p className="text-xs text-slate-400">Kabupaten Pangkep</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Website resmi Kelurahan Borimasunggu, Kecamatan Labakkang, Kabupaten Pangkep, Sulawesi Selatan.
            </p>
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
