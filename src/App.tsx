import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // ⚠️ sesuaikan path ini dengan lokasi file ThemeProvider kamu

// Layout & halaman publik
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Beranda from './pages/Beranda';
import ProfilKelurahan from './pages/ProfilKelurahan';
import PotensiKelurahan from './pages/PotensiKelurahan';
import BeritaPage from './pages/BeritaPage';
import Agenda from './pages/Agenda';
import Galeri from './pages/Galeri';
import LayananPublik from './pages/LayananPublik';
import Kontak from './pages/Kontak';
import BeritaDetail from './pages/Beritadetail.tsx'
import NotFound from './pages/NotFound';

// Admin
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProfilAdmin from './pages/admin/Profiladmin';
import PejabatAdmin from './pages/admin/Pejabatadmin';
import StatistikAdmin from './pages/admin/Statistikadmin';
import ProgramAdmin from './pages/admin/Programadmin';
import TestimoniAdmin from './pages/admin/Testimoniadmin';
import BeritaAdmin from './pages/admin/BeritaAdmin';
import AgendaAdmin from './pages/admin/Agendaadmin';
import GaleriAdmin from './pages/admin/Galeriadmin';
import PotensiAdmin from './pages/admin/Potensiadmin';
import PotensiInfografisAdmin from './pages/admin/Potensiinfografis';
import LayananAdmin from './pages/admin/Layananadmin';
import PesanKontakAdmin from './pages/admin/PesanKontakAdmin';


// Scroll ke atas setiap kali pindah halaman
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Layout untuk halaman publik (dengan Navbar + Footer)
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/profil" element={<ProfilKelurahan />} />
          <Route path="/potensi" element={<PotensiKelurahan />} />
          <Route path="/berita" element={<BeritaPage />} />
          <Route path="/berita/:slug" element={<BeritaDetail />} />
          <Route path="/berita" element={<BeritaPage />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/layanan" element={<LayananPublik />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Login admin — tanpa AdminLayout/sidebar */}
            <Route path="/admin" element={<Login />} />

            {/* Halaman admin — dilindungi ProtectedRoute + pakai AdminLayout */}
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/profil"
              element={<ProtectedRoute><AdminLayout><ProfilAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/pejabat"
              element={<ProtectedRoute><AdminLayout><PejabatAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/statistik"
              element={<ProtectedRoute><AdminLayout><StatistikAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/program"
              element={<ProtectedRoute><AdminLayout><ProgramAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/testimoni"
              element={<ProtectedRoute><AdminLayout><TestimoniAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/berita"
              element={<ProtectedRoute><AdminLayout><BeritaAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/agenda"
              element={<ProtectedRoute><AdminLayout><AgendaAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/galeri"
              element={<ProtectedRoute><AdminLayout><GaleriAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/potensi"
              element={<ProtectedRoute><AdminLayout><PotensiAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/potensi-infografis"
              element={<ProtectedRoute><AdminLayout><PotensiInfografisAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/layanan"
              element={<ProtectedRoute><AdminLayout><LayananAdmin /></AdminLayout></ProtectedRoute>}
            />
            <Route
              path="/admin/pesan-kontak"
              element={<ProtectedRoute><AdminLayout><PesanKontakAdmin /></AdminLayout></ProtectedRoute>}
            />

            {/* Semua route selain /admin/* masuk ke layout publik */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;