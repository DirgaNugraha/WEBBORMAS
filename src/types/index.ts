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
  id: number;
  judul: string;
  kategori: string;
  tanggal: string;
  excerpt?: string;
  konten: string;
  gambar?: string;
  penulis?: string;
  // Properti tambahan untuk Berita Eksternal
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
}

export interface ProgramItem {
  id: number;
  judul: string;
  deskripsi: string;
  icon: string;
  progress: number;
}

export interface TestimonialItem {
  id: number;
  nama: string;
  peran: string;
  pesan: string;
  avatar: string;
}

export interface IconEntry {
  name: string;
  Icon: LucideIcon;
}

export type AgendaFilter = 'all' | 'upcoming' | 'selesai';