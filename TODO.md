# TODO - Refactor Struktur & Performa

Status: **SELESAI** ✅ — Typecheck bersih (npx tsc --noEmit -p tsconfig.app.json)

## Fase 1: Pecah `dataService.ts` per domain (barrel re-export)
- [x] Buat `services/helpers.ts` + `services/errorHandler.ts` (helper error terpusat)
- [x] Buat `services/beritaService.ts`
- [x] Buat `services/galeriService.ts`
- [x] Buat `services/agendaService.ts`
- [x] Buat `services/profilService.ts` (kelurahan info + pejabat)
- [x] Buat `services/potensiService.ts`
- [x] Buat `services/layananService.ts`
- [x] Buat `services/statistikService.ts` (stats + program)
- [x] Buat `services/pesanKontakService.ts`
- [x] Ubah `services/dataService.ts` menjadi barrel re-export
- [x] Jalankan build/typecheck (bersih)

## Fase 2: Pagination (sisi query/admin) + Optimasi Query
- [x] `Adminservice.list()`: tambah opsi `{ page, perPage }`
- [x] Optimasi `getGaleriKategori()` (query distinct di DB, tanpa full-scan)
- [x] Optimasi `getBeritaBySlug()` (kurangi query beruntun, hapus `ilike` full-scan)
- [x] Jalankan build/typecheck (bersih)

## Fase 3: Rename file admin + error handling konsisten
- [x] `Galeriadmin`→`GaleriAdmin`, `Agendaadmin`→`AgendaAdmin`, `Profiladmin`→`ProfilAdmin`
- [x] `Pejabatadmin`→`PejabatAdmin`, `Statistikadmin`→`StatistikAdmin`, `Layananadmin`→`LayananAdmin`, `Potensiadmin`→`PotensiAdmin`, `Programadmin`→`ProgramAdmin`
- [x] Update import di `App.tsx` & `AdminRoutes.tsx`
- [x] Jalankan build/typecheck (bersih)

## Fase 4: Lazy loading + Pecah routing `App.tsx`
- [x] Buat `routes/PublicRoutes.tsx` dan `routes/AdminRoutes.tsx`
- [x] Implementasi `React.lazy` + `Suspense` halaman admin
- [x] `App.tsx` jadi ringan
- [x] Jalankan build/typecheck (bersih)

## Fase 5: Validasi data (zod)
- [x] Install `zod`
- [x] Buat `types/schemas.ts` (schema Berita, Galeri, Agenda, PesanKontak + safeParse)
- [x] Terapkan `pesanKontakInputSchema` di form publik `Kontak.tsx` (validasi sebelum insert)
- [x] Jalankan build/typecheck (bersih)

## Catatan
- Halaman publik tetap menampilkan semua data (tanpa pagination UI) sesuai permintaan.
- Pagination diterapkan di sisi query/admin (`Adminservice.list()`).
- `dataService.ts` dipertahankan sebagai barrel re-export agar impor halaman publik tidak berubah.
- Zod diterapkan secara aman (validasi input form) tanpa mengubah bentuk data eksisting.
