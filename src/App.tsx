import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';

// Layout & halaman publik
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Login from './pages/admin/Login';

// Routes terpisah (dengan lazy loading)
import PublicRoutes from './routes/PublicRoutes';
import AdminRoutes from './routes/AdminRoutes';

// Fallback saat halaman lazy dimuat
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Scroll ke atas setiap kali pindah halaman
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Layout untuk halaman publik (dengan Navbar + Footer)
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <PublicRoutes />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Login admin — tanpa AdminLayout/sidebar */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            {/* Halaman admin — dilindungi ProtectedRoute + pakai AdminLayout */}
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminRoutes />
                </Suspense>
              }
            />

            {/* Semua route selain /admin/* masuk ke layout publik */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
