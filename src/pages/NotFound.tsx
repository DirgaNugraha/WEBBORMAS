export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-primary-600 dark:text-primary-400 mb-3">404</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">Halaman tidak ditemukan</p>
        <a href="/" className="btn-primary">Kembali ke Beranda</a>
      </div>
    </div>
  );
}
