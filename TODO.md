# TODO - TAHAP 2: Eksekusi Perbaikan Kode Audit

## Poin 1 (TINGGI) - Routing Auth Login ✅
- [x] `src/App.tsx`: Tambah rute `/admin/login` + redirect `/admin` ke `/admin/login`
- [x] `src/components/admin/ProtectedRoute.tsx`: Ubah redirect ke `/admin/login`
- [x] `src/components/admin/AdminLayout.tsx`: Ubah navigasi logout ke `/admin/login`

## Poin 2 (SEDANG) - Performa getBeritaBySlug ✅
- [x] `src/services/dataService.ts`: Ganti fallback `getBeritaList()` dengan query DB langsung

## Poin 3 (SEDANG) - Keamanan RLS (panduan Supabase)
- [ ] Dokumentasi SQL policy untuk pesan_kontak & tabel admin (disampaikan sebagai panduan di hasil akhir)

## Poin 4 (RENDAH) - getBeritaById ✅
- [x] `src/services/dataService.ts`: Ganti `.single()` menjadi `.maybeSingle()` + tangani null

## Poin 5 (RENDAH) - Error handling mutasi ✅
- [x] `src/pages/admin/PesanKontakAdmin.tsx`: Tangani error pada handleOpen & handleUpdateStatus
- [x] `src/pages/admin/BeritaAdmin.tsx`: handleDelete sudah menangani error (catch + alert)

## Verifikasi
- [ ] Jalankan typecheck & build untuk memastikan tidak ada error
