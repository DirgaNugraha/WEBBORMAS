import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Building2 } from 'lucide-react';
import { navItems } from '../data/navigation';
import { useTheme } from '../hooks/useTheme';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrollPosition(20);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-lg shadow-slate-200/30 dark:shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-page">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={`font-bold text-sm md:text-base transition-colors ${
                  scrolled ? 'text-slate-900 dark:text-white' : 'text-white'
                }`}
              >
                Kelurahan Borimasunggu
              </span>
              <span
                className={`text-xs transition-colors ${
                  scrolled ? 'text-slate-500 dark:text-slate-400' : 'text-primary-100'
                }`}
              >
                Kabupaten Soppeng
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
                  `relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? scrolled
                        ? 'text-primary-700 dark:text-primary-400'
                        : 'text-white'
                      : scrolled
                        ? 'text-slate-600 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-400'
                        : 'text-primary-100 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="navIndicator"
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full ${
                          scrolled ? 'bg-primary-600 dark:bg-primary-400' : 'bg-white'
                        }`}
                        style={{ width: '60%' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-colors ${
                scrolled
                  ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                scrolled
                  ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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
            className="lg:hidden overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
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
                          ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
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
