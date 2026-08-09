import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface KelurahanInfo {
  nama: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  alamat: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  jamLayanan: string;
  jumlahRW: number;
  jumlahRT: number;
  jumlahPenduduk: number;
  luasWilayah: string;
  visi: string;
  misi: string[];
  sejarah: string;
}

export interface Pejabat {
  id: number;
  nama: string;
  jabatan: string;
  foto: string;
  nip: string;
}

export interface Potensi {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  gambar: string;
  icon: string;
}

export interface Berita {
  id: string; // UUID dari Supabase
  slug?: string;
  judul: string;
  kategori: string;
  tanggal: string;
excerpt?: string;
  konten: string;
  gambar?: string;
  penulis?: string;

  // Properti frontend (camelCase), tanpa `null` agar kompatibel dengan
  // atribut JSX seperti `src` dan `href` yang hanya menerima `string | undefined`.
  // Kolom DB snake_case (is_eksternal, nama_sumber, link_asli) dikonversi
  // terpusat di dataService (formatBeritaItem) menjadi `undefined` saat kosong.
  isEksternal?: boolean;
  namaSumber?: string;
  linkAsli?: string;
}

export interface Agenda {
  id: number;
  judul: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  kategori: string;
  deskripsi: string;
  status: 'upcoming' | 'selesai';
}

export interface GaleriItem {
  id: number;
  judul: string;
  kategori: string;
  gambar: string;
  tanggal: string;
}

export interface Layanan {
  id: number;
  nama: string;
  deskripsi: string;
  icon: string;
  syarat: string[];
  durasi: string;
  biaya: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
  urutan?: number;
}

export interface ProgramItem {
  id: number;
  judul: string;
  deskripsi: string;
  icon: string;
  progress: number;
}

export interface IconEntry {
  name: string;
  Icon: LucideIcon;
}

export type AgendaFilter = 'all' | 'upcoming' | 'selesai';

// ============================================================
// PESAN KONTAK / PENGADUAN (public.pesan_kontak)
// ============================================================
export type PesanKontakStatus =
  | 'baru'
  | 'dibaca'
  | 'ditindaklanjuti'
  | 'selesai';

export interface PesanKontak {
  id: string; // uuid
  nama: string;
  telepon: string; // Nomor WhatsApp (format internasional 62xxx)
  subjek: string;
  pesan: string;
  status: PesanKontakStatus;
  catatan_admin?: string;
  created_at: string;
  updated_at?: string;
}
