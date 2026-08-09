# TODO - Peta Perbaikan Aplikasi Web Kelurahan Borimasunggu

> Daftar seluruh tugas refactor, perbaikan, dan penambahan fitur.
> Yang sudah selesai ditandai `[x]`, yang belum `[ ]`.

---

## BAGIAN A — SELESAI ✅ (Sudah dikerjakan)

### A.1 Pecah `dataService` per domain (barrel)
- [x] Buat `services/helpers.ts` + `services/errorHandler.ts` (error terpusat)
- [x] Buat `beritaService`, `galeriService`, `agendaService`, `profilService`, `potensiService`, `layananService`, `statistikService`, `pesanKontakService`
- [x] Ubah `services/dataService.ts` menjadi barrel re-export (impor halaman tidak berubah)

### A.2 Pagination sisi query/admin + optimasi query
- [x] `Adminservice.list()` mendukung `{ page, perPage }` via `.range()`
- [x] Optimasi `getGaleriKategori()` (hanya select `kategori`, tanpa full-scan kolom)
- [x] Optimasi `getBeritaBySlug()` (hapus `ilike '%...%'` full-scan)

### A.3 Konsistensi nama file admin & error handling
- [x] Rename `Galeriadmin`→`GaleriAdmin`, `Agendaadmin`→`AgendaAdmin`, `Profiladmin`→`ProfilAdmin`
- [x] Rename `Pejabatadmin`→`PejabatAdmin`, `Statistikadmin`→`StatistikAdmin`, `Layananadmin`→`LayananAdmin`, `Potensiadmin`→`PotensiAdmin`, `Programadmin`→`ProgramAdmin`
- [x] Update import di `App.tsx` & `AdminRoutes.tsx`

### A.4 Lazy loading + pecah routing
- [x] Buat `routes/PublicRoutes.tsx` dan `routes/AdminRoutes.tsx`
- [x] Implementasi `React.lazy` + `Suspense` halaman admin
- [x] `App.tsx` jadi ringan
- [x] Fix blank screen admin (route pakai path relatif di bawah `<Route path="/admin/*">`)

### A.5 Validasi data (zod)
- [x] Install `zod`
- [x] Buat `types/schemas.ts` (schema Berita, Galeri, Agenda, PesanKontak + safeParse)
- [x] Terapkan `pesanKontakInputSchema` di form `Kontak.tsx`

### A.6 Pagination + "Load More" di halaman publik
- [x] `beritaService.getBeritaPage()` / `galeriService.getGaleriPage()` / `agendaService.getAgendaPage()` via `.range()` + `count`
- [x] Ekspos ketiganya di `dataService`
- [x] `BeritaPage.tsx` (9/load), `Galeri.tsx` (12/load), `Agenda.tsx` (10/load) + tombol "Muat Lebih Banyak"
- [x] Typecheck bersih

### A.7 Tambah Section "Potensi & Keunggulan Wilayah" di Beranda
- [x] Update `src/pages/Beranda.tsx`: import (Sprout, Info icon, Potensi type)
- [x] Tambah state `potensiList` dan `selectedPotensi`
- [x] Fetch data potensi di `loadData()` (`dataService.getPotensiList`, ambil 4)
- [x] Tambah section "Potensi & Keunggulan Wilayah" setelah section Profil & Peta
- [x] Tambah Modal detail Potensi (`src/components/PotensiModal.tsx`)

### A.8 Header Putih — Navbar transparan mengikuti PageHeader
- [x] Analisis `Navbar.tsx`, `PageHeader.tsx`, `index.css`, `tailwind.config.js`
- [x] Ubah `src/components/ui/PageHeader.tsx` → background putih + teks gelap + border-b
- [x] Ubah `src/layouts/Navbar.tsx` → navbar transparan (`isSolid = scrolled`), teks gelap saat solid / di halaman sub (`useDarkText`)
- [x] Jalankan `tsc` untuk verifikasi tidak ada error

---

## BAGIAN B — BELUM SELESAI 🔧 (Langkah perbaikan berikutnya)

### B.1 Prioritas tinggi — Keamanan & Kesiapan Produksi
- [x] **Siapkan script RLS + index (SQL)** di `supabase/security_policies.sql`
  - Enable RLS semua tabel, policy anon-read + authenticated-CRUD, index untuk kolom sering di-query.
- [x] **Buat `.env.example`** sebagai referensi env tanpa nilai asli.
- [x] **Verifikasi env var aman** — `.gitignore` sudah memuat `.env`.
- [ ] **Jalankan `supabase/security_policies.sql`** di dashboard Supabase → SQL Editor.
  - (Langkah manual oleh user; setelah ini anon hanya bisa baca konten publik + insert pesan kontak.)
- [ ] **Uji end-to-end sebelum deploy**
  - Alur: pengaduan (Kontak) → muncul di Dashboard admin; CRUD semua konten; login/logout admin.

### B.2 Prioritas sedang — Konsistensi & Pengalaman Admin
- [x] **Refactor `BeritaAdmin.tsx` ke `adminService` + `errorHandler`**
  - Saat ini masih query Supabase langsung + `try/catch` manual di dalam komponen. Pindahkan ke service agar konsisten.
- [x] **Ganti `alert()` / `confirm()` bawaan browser dengan notifikasi (toast)**
  - Buat komponen `Toast`/`useToast` (atau install library toast) untuk feedback yang lebih profesional.
  - `useToast` sudah ada di `components/ui/Toast.tsx`; `BeritaAdmin` sudah memakainya untuk success/error.
  - `confirm()` di `BeritaAdmin` diganti modal konfirmasi hapus inline (state `deleteTarget`).
- [ ] **Standarisasi nama service**: samakan casing `adminService` (rapikan `Adminservice.ts` → `adminService.ts` bila perlu) dan konsisten di semua impor.
- [ ] **Kurangi `any`** — contoh `formatBeritaItem(item: any)` → gunakan tipe ketat atau validasi zod saat parse data.

### B.3 Prioritas sedang — Performa & Pengalaman Pengguna Publik
- [ ] **Tambah lazy loading gambar (`loading="lazy"`)** pada kartu berita/galeri di halaman publik (beberapa masih dimuat langsung).
- [ ] **Optimasi gambar** — pakai transformasi/resize Supabase Storage (thumbnail) agar bandwidth & loading cepat.
- [ ] **(Opsional) Integrasikan TanStack Query** untuk caching data publik (kurangi request ulang per navigasi).

### B.4 Prioritas rendah — Robustness / Nice-to-have
- [ ] **(Opsional) Tambah unit test** untuk service (misal Vitest) — tidak wajib untuk skala kelurahan.
- [ ] **(Opsional) Observability** — logging error terpusat (misal Sentry) bila traffic naik drastis.
- [ ] **(Opsional) Error boundary** global agar satu error tidak mengosongkan seluruh halaman.

---

## BAGIAN C — CATATAN / REKOMENDASI

- **Fungsional**: Aplikasi sudah CUKUP untuk web kelurahan (portal publik + CMS admin lengkap, responsif, modern).
- **Produksi**: Sebelum deploy, kerjakan minimal **B.1 (RLS + index + cek env)** dan **uji end-to-end**.
- **Skala**: Traffic & data kelurahan kecil-menengah → ketahanan aplikasi sudah melebihi standar. Fitur enterprise (test ekstensif, monitoring) tidak wajib untuk level ini.

---

## TABEL RINGKASAN STATUS

| Bagian | Status |
|--------|--------|
| A.1 Pecah service per domain | ✅ Selesai |
| A.2 Pagination query/admin + optimasi | ✅ Selesai |
| A.3 Rename file admin | ✅ Selesai |
| A.4 Lazy loading + pecah routing | ✅ Selesai |
| A.5 Validasi zod | ✅ Selesai |
| A.6 Pagination + Load More publik | ✅ Selesai |
| A.7 Section Potensi di Beranda | ✅ Selesai |
| A.8 Header Putih (Navbar transparan) | ✅ Selesai |
| B.1 RLS + index + cek env + uji E2E | 🔧 Belum |
| B.2 Konsistensi admin (toast, service, any) | 🔧 Belum |
| B.3 Optimasi gambar + lazyload + cache | 🔧 Belum |
| B.4 Testing + observability + error boundary | 🔧 Belum |
