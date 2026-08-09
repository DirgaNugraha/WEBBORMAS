import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/admin/ProtectedRoute';
import AdminLayout from '../components/admin/AdminLayout';

// Lazy load halaman admin agar tidak membebani bundle publik
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const ProfilAdmin = lazy(() => import('../pages/admin/ProfilAdmin'));
const PejabatAdmin = lazy(() => import('../pages/admin/PejabatAdmin'));
const StatistikAdmin = lazy(() => import('../pages/admin/StatistikAdmin'));
const ProgramAdmin = lazy(() => import('../pages/admin/ProgramAdmin'));
const BeritaAdmin = lazy(() => import('../pages/admin/BeritaAdmin'));
const AgendaAdmin = lazy(() => import('../pages/admin/AgendaAdmin'));
const GaleriAdmin = lazy(() => import('../pages/admin/GaleriAdmin'));
const PotensiAdmin = lazy(() => import('../pages/admin/PotensiAdmin'));
const LayananAdmin = lazy(() => import('../pages/admin/LayananAdmin'));
const PesanKontakAdmin = lazy(() => import('../pages/admin/PesanKontakAdmin'));
const EditProfil = lazy(() => import('../pages/admin/EditProfil'));

// Konfigurasi route admin agar mudah ditambah halaman baru.
// Catatan: `AdminRoutes` dirender di dalam `<Route path="/admin/*">` di App.tsx,
// sehingga path di sini harus RELATIF (tanpa prefix /admin).
const adminRoutes = [
  { path: 'dashboard', element: <Dashboard /> },
  { path: 'profil', element: <ProfilAdmin /> },
  { path: 'pejabat', element: <PejabatAdmin /> },
  { path: 'statistik', element: <StatistikAdmin /> },
  { path: 'program', element: <ProgramAdmin /> },
  { path: 'berita', element: <BeritaAdmin /> },
  { path: 'agenda', element: <AgendaAdmin /> },
  { path: 'galeri', element: <GaleriAdmin /> },
  { path: 'potensi', element: <PotensiAdmin /> },
  { path: 'layanan', element: <LayananAdmin /> },
  { path: 'pesan-kontak', element: <PesanKontakAdmin /> },
  { path: 'edit-profil', element: <EditProfil /> },
];

export default function AdminRoutes() {
  return (
    <Routes>
      {adminRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute>
              <AdminLayout>{route.element}</AdminLayout>
            </ProtectedRoute>
          }
        />
      ))}
    </Routes>
  );
}
