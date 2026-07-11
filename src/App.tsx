import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './layouts/Layout';
import Beranda from './pages/Beranda';

const ProfilKelurahan = lazy(() => import('./pages/ProfilKelurahan'));
const PotensiKelurahan = lazy(() => import('./pages/PotensiKelurahan'));
const BeritaPage = lazy(() => import('./pages/BeritaPage'));
const Agenda = lazy(() => import('./pages/Agenda'));
const Galeri = lazy(() => import('./pages/Galeri'));
const LayananPublik = lazy(() => import('./pages/LayananPublik'));
const Kontak = lazy(() => import('./pages/Kontak'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Beranda />} />
              <Route path="/profil" element={<ProfilKelurahan />} />
              <Route path="/potensi" element={<PotensiKelurahan />} />
              <Route path="/berita" element={<BeritaPage />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/galeri" element={<Galeri />} />
              <Route path="/layanan" element={<LayananPublik />} />
              <Route path="/kontak" element={<Kontak />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
