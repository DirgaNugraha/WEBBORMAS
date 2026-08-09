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

// Konfigurasi route admin agar mudah ditambah halaman baru
const adminRoutes = [
  { path: '/admin/dashboard', element: <Dashboard /> },
  { path: '/admin/profil', element: <ProfilAdmin /> },
  { path: '/admin/pejabat', element: <PejabatAdmin /> },
  { path: '/admin/statistik', element: <StatistikAdmin /> },
  { path: '/admin/program', element: <ProgramAdmin /> },
  { path: '/admin/berita', element: <BeritaAdmin /> },
  { path: '/admin/agenda', element: <AgendaAdmin /> },
  { path: '/admin/galeri', element: <GaleriAdmin /> },
  { path: '/admin/potensi', element: <PotensiAdmin /> },
  { path: '/admin/layanan', element: <LayananAdmin /> },
  { path: '/admin/pesan-kontak', element: <PesanKontakAdmin /> },
  { path: '/admin/edit-profil', element: <EditProfil /> },
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
