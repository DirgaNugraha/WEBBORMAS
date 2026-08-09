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

## Langkah 1 (baru): Pagination + "Load More" di halaman publik ✅
- [x] `beritaService`: tambah `getBeritaPage` + pagination via `.range()`
- [x] `galeriService`: tambah `getGaleriPage` + pagination via `.range()`
- [x] `agendaService`: tambah `getAgendaPage` + pagination via `.range()`
- [x] Ekspos `getBeritaPage`/`getGaleriPage`/`getAgendaPage` di `dataService`
- [x] `BeritaPage.tsx`: ganti ke `getBeritaPage` + tombol "Muat Lebih Banyak"
- [x] `Galeri.tsx`: ganti ke `getGaleriPage` + tombol "Muat Lebih Banyak"
- [x] `Agenda.tsx`: ganti ke `getAgendaPage` + tombol "Muat Lebih Banyak"
- [x] Jalankan typecheck (bersih)

## Langkah 2: Index database (Supabase) - BELUM
- [ ] Siapkan skrip SQL untuk index di Supabase (tanggal, status, slug)

## Langkah 3: Caching data publik (TanStack Query) - BELUM
- [ ] Integrasikan TanStack Query untuk caching data publik

## Catatan
- Halaman publik kini memuat data bertahap dengan tombol "Muat Lebih Banyak" (Load More) agar tidak menarik seluruh tabel sekaligus saat data banyak.
- Pagination diterapkan di sisi query (`dataService` + `Adminservice.list()`) via `.range()`.
- `dataService.ts` dipertahankan sebagai barrel re-export agar impor halaman publik tetap konsisten.
- Zod diterapkan secara aman (validasi input form) tanpa mengubah bentuk data eksisting.
