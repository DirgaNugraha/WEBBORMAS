import { useState, ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Newspaper, CalendarDays, Images, Briefcase, Sprout,
  Building2, Users, TrendingUp, MessageSquareQuote, BarChart3, Layers,
  Mail, Menu, X, LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoKpKp from '../../aset/logopkp.png';

const menuItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/profil', label: 'Profil Kelurahan', icon: Building2 },
  { to: '/admin/pejabat', label: 'Pejabat', icon: Users },
  { to: '/admin/statistik', label: 'Statistik Beranda', icon: BarChart3 },
  { to: '/admin/program', label: 'Program Unggulan', icon: TrendingUp },
  { to: '/admin/testimoni', label: 'Testimoni', icon: MessageSquareQuote },
  { to: '/admin/berita', label: 'Berita', icon: Newspaper },
  { to: '/admin/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/admin/galeri', label: 'Galeri', icon: Images },
  { to: '/admin/potensi', label: 'Potensi Kelurahan', icon: Sprout },
  { to: '/admin/potensi-infografis', label: 'Infografis Potensi', icon: Layers },
  { to: '/admin/layanan', label: 'Layanan Publik', icon: Briefcase },
  { to: '/admin/pesan-kontak', label: 'Pesan Kontak', icon: Mail },
];

function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shrink-0">
            <img
                  src={logoKpKp}
                  alt="Logo Kelurahan Borimasunggu"
                  className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
            Admin Kelurahan<br />Borimasunggu
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 w-full transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 dark:text-slate-400"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
              {user?.email}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;