-- ============================================================
-- KELURAHAN BORIMASUNGGU — SECURITY & PERFORMANCE SETUP
-- Jalankan script ini di: Supabase Dashboard → SQL Editor → New query
--
-- Isi:
--   1) Aktifkan RLS (Row Level Security) pada semua tabel
--   2) Buat policy akses (anon publik-read, authenticated full-CRUD)
--   3) Buat index untuk kolom yang sering di-query
--
-- CATATAN PENTING:
--   - Script ini IDEMPOTEN (aman dijalankan ulang).
--   - Pastikan sudah ada user admin di Supabase Auth yang akan login lewat
--     panel admin. Policy "authenticated" berlaku untuk SEMUA user yang login.
--   - Jika ingin membatasi admin hanya pada email tertentu, lihat komentar
--     di bagian bawah (opsional).
-- ============================================================

-- ------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY pada semua tabel
-- ------------------------------------------------------------
ALTER TABLE public.profil_kelurahan   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pejabat_kelurahan  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.potensi_kelurahan  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layanan_publik     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistik_beranda  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_kelurahan  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.potensi_infografis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesan_kontak       ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 2. BUANG POLICY LAMA (agar aman dijalankan ulang)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Publik bisa baca profil" ON public.profil_kelurahan;
DROP POLICY IF EXISTS "Admin kelola profil" ON public.profil_kelurahan;

DROP POLICY IF EXISTS "Publik bisa baca pejabat" ON public.pejabat_kelurahan;
DROP POLICY IF EXISTS "Admin kelola pejabat" ON public.pejabat_kelurahan;

DROP POLICY IF EXISTS "Publik bisa baca potensi" ON public.potensi_kelurahan;
DROP POLICY IF EXISTS "Admin kelola potensi" ON public.potensi_kelurahan;

DROP POLICY IF EXISTS "Publik bisa baca berita" ON public.berita;
DROP POLICY IF EXISTS "Admin kelola berita" ON public.berita;

DROP POLICY IF EXISTS "Publik bisa baca agenda" ON public.agenda;
DROP POLICY IF EXISTS "Admin kelola agenda" ON public.agenda;

DROP POLICY IF EXISTS "Publik bisa baca galeri" ON public.galeri;
DROP POLICY IF EXISTS "Admin kelola galeri" ON public.galeri;

DROP POLICY IF EXISTS "Publik bisa baca layanan" ON public.layanan_publik;
DROP POLICY IF EXISTS "Admin kelola layanan" ON public.layanan_publik;

DROP POLICY IF EXISTS "Publik bisa baca statistik" ON public.statistik_beranda;
DROP POLICY IF EXISTS "Admin kelola statistik" ON public.statistik_beranda;

DROP POLICY IF EXISTS "Publik bisa baca program" ON public.program_kelurahan;
DROP POLICY IF EXISTS "Admin kelola program" ON public.program_kelurahan;

DROP POLICY IF EXISTS "Publik bisa baca infografis" ON public.potensi_infografis;
DROP POLICY IF EXISTS "Admin kelola infografis" ON public.potensi_infografis;

DROP POLICY IF EXISTS "Publik bisa kirim pesan" ON public.pesan_kontak;
DROP POLICY IF EXISTS "Admin kelola pesan" ON public.pesan_kontak;

-- ------------------------------------------------------------
-- 3. BUAT POLICY
-- ------------------------------------------------------------
-- Pola umum:
--   anon (publik)  -> SELECT (baca konten)
--   authenticated  -> SELECT, INSERT, UPDATE, DELETE (admin CRUD)

-- ===== PROFIL KELURAHAN =====
CREATE POLICY "Publik bisa baca profil"
  ON public.profil_kelurahan FOR SELECT USING (true);

CREATE POLICY "Admin kelola profil"
  ON public.profil_kelurahan FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== PEJABAT KELURAHAN =====
CREATE POLICY "Publik bisa baca pejabat"
  ON public.pejabat_kelurahan FOR SELECT USING (true);

CREATE POLICY "Admin kelola pejabat"
  ON public.pejabat_kelurahan FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== POTENSI KELURAHAN =====
CREATE POLICY "Publik bisa baca potensi"
  ON public.potensi_kelurahan FOR SELECT USING (true);

CREATE POLICY "Admin kelola potensi"
  ON public.potensi_kelurahan FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== BERITA =====
CREATE POLICY "Publik bisa baca berita"
  ON public.berita FOR SELECT USING (true);

CREATE POLICY "Admin kelola berita"
  ON public.berita FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== AGENDA =====
CREATE POLICY "Publik bisa baca agenda"
  ON public.agenda FOR SELECT USING (true);

CREATE POLICY "Admin kelola agenda"
  ON public.agenda FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== GALERI =====
CREATE POLICY "Publik bisa baca galeri"
  ON public.galeri FOR SELECT USING (true);

CREATE POLICY "Admin kelola galeri"
  ON public.galeri FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== LAYANAN PUBLIK =====
CREATE POLICY "Publik bisa baca layanan"
  ON public.layanan_publik FOR SELECT USING (true);

CREATE POLICY "Admin kelola layanan"
  ON public.layanan_publik FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== STATISTIK BERANDA =====
CREATE POLICY "Publik bisa baca statistik"
  ON public.statistik_beranda FOR SELECT USING (true);

CREATE POLICY "Admin kelola statistik"
  ON public.statistik_beranda FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== PROGRAM KELURAHAN =====
CREATE POLICY "Publik bisa baca program"
  ON public.program_kelurahan FOR SELECT USING (true);

CREATE POLICY "Admin kelola program"
  ON public.program_kelurahan FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== POTENSI INFOGRAFIS =====
CREATE POLICY "Publik bisa baca infografis"
  ON public.potensi_infografis FOR SELECT USING (true);

CREATE POLICY "Admin kelola infografis"
  ON public.potensi_infografis FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== PESAN KONTAK (PENGADUAN) =====
-- Publik BOLEH INSERT (mengirim pengaduan), tapi TIDAK boleh baca daftar
-- Isi pesan hanya bisa diakses oleh admin (authenticated).
CREATE POLICY "Publik bisa kirim pesan"
  ON public.pesan_kontak FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin kelola pesan"
  ON public.pesan_kontak FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- 4. INDEX UNTUK PERFORMA (data bertambah banyak)
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_berita_tanggal  ON public.berita (tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_berita_slug     ON public.berita (slug);
CREATE INDEX IF NOT EXISTS idx_berita_kategori ON public.berita (kategori);

CREATE INDEX IF NOT EXISTS idx_agenda_tanggal  ON public.agenda (tanggal);
CREATE INDEX IF NOT EXISTS idx_agenda_status   ON public.agenda (status);

CREATE INDEX IF NOT EXISTS idx_galeri_tanggal  ON public.galeri (tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_galeri_kategori ON public.galeri (kategori);

CREATE INDEX IF NOT EXISTS idx_pejabat_urutan  ON public.pejabat_kelurahan (urutan);
CREATE INDEX IF NOT EXISTS idx_potensi_created ON public.potensi_kelurahan (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_layanan_created ON public.layanan_publik (created_at);
CREATE INDEX IF NOT EXISTS idx_program_urutan  ON public.program_kelurahan (urutan);
CREATE INDEX IF NOT EXISTS idx_statistik_urutan ON public.statistik_beranda (urutan);
CREATE INDEX IF NOT EXISTS idx_infografis_urutan ON public.potensi_infografis (urutan);
CREATE INDEX IF NOT EXISTS idx_pesan_created   ON public.pesan_kontak (created_at DESC);

-- ============================================================
-- OPSIONAL: Batasi admin hanya pada email tertentu
-- ------------------------------------------------------------
-- Jika Anda TIDAK ingin SEMUA user yang login bisa mengelola data,
-- gunakan versi di bawah ini (ganti 'admin@kelurahanborimasunggu.id').
-- Lalu hapus/jangan pakai policy "Admin kelola ..." yang berbasis
-- auth.role() di atas, atau timpa dengan policy yang lebih ketat.
--
-- CREATE POLICY "Admin kelola berita (restricted)"
--   ON public.berita FOR ALL
--   USING (auth.jwt() ->> 'email' = 'admin@kelurahanborimasunggu.id')
--   WITH CHECK (auth.jwt() ->> 'email' = 'admin@kelurahanborimasunggu.id');
-- ============================================================
