import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load halaman publik agar bundle lebih kecil
const Beranda = lazy(() => import('../pages/Beranda'));
const ProfilKelurahan = lazy(() => import('../pages/ProfilKelurahan'));
const PotensiKelurahan = lazy(() => import('../pages/PotensiKelurahan'));
const BeritaPage = lazy(() => import('../pages/BeritaPage'));
const BeritaDetail = lazy(() => import('../pages/Beritadetail'));
const Agenda = lazy(() => import('../pages/Agenda'));
const Galeri = lazy(() => import('../pages/Galeri'));
const LayananPublik = lazy(() => import('../pages/LayananPublik'));
const Kontak = lazy(() => import('../pages/Kontak'));
const NotFound = lazy(() => import('../pages/NotFound'));

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Beranda />} />
      <Route path="/profil" element={<ProfilKelurahan />} />
      <Route path="/potensi" element={<PotensiKelurahan />} />
      <Route path="/berita" element={<BeritaPage />} />
      <Route path="/berita/:slug" element={<BeritaDetail />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/galeri" element={<Galeri />} />
      <Route path="/layanan" element={<LayananPublik />} />
      <Route path="/kontak" element={<Kontak />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
