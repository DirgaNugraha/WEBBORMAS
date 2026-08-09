import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logoKpKp from '../aset/logopkp.png';

import { navItems } from '../data/navigation';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrollPosition(20);
  const location = useLocation();

// Navbar transparan di atas, solid (putih) saat scroll — tanpa paksaan route
  const isSolid = scrolled;
  // Teks gelap digunakan ketika latar putih: saat solid (scroll) ATAU di halaman sub
  // (di atas PageHeader yang putih). Di beranda (di atas hero) teks tetap putih.
  const isBeranda = location.pathname === '/';
  const useDarkText = isSolid || !isBeranda;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? 'bg-white border-b border-slate-200 shadow-sm shadow-slate-200/30'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-page">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoKpKp}
              alt="Logo Kelurahan Borimasunggu"
              className="w-11 h-11 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col leading-tight">
<span
                className={`font-bold text-sm md:text-base transition-colors ${
                  useDarkText ? 'text-slate-900 ' : 'text-white'
                }`}
              >
                Kelurahan Borimasunggu
              </span>
              <span
                className={`text-xs transition-colors ${
                  useDarkText ? 'text-slate-500 ' : 'text-primary-100'
                }`}
              >
                Kabupaten Pangkajene dan Kepulauan
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? useDarkText
                        ? 'text-primary-700 '
                        : 'text-white'
                      : useDarkText
                        ? 'text-slate-600  hover:text-primary-700 '
                        : 'text-primary-100 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative inline-block">
                    {item.label}

                    {isActive && (
                      <motion.span
                        layoutId="navIndicator"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
className={`absolute left-0 right-0 -bottom-3 h-1 rounded-full ${
                          useDarkText
                            ? 'bg-primary-600 '
                            : 'bg-white'
                        }`}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

{/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                useDarkText
                  ? 'text-slate-600  hover:bg-slate-100 '
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white  border-t border-slate-200 "
          >
            <div className="container-page py-4">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50  text-primary-700 '
                          : 'text-slate-600  hover:bg-slate-50 '
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}