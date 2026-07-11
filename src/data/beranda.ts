import type { StatItem, ProgramItem, TestimonialItem } from '../types';

export const statsData: StatItem[] = [
  { label: 'Jumlah Penduduk', value: '8.420', icon: 'Users', color: 'primary' },
  { label: 'Rukun Warga (RW)', value: '5', icon: 'Home', color: 'secondary' },
  { label: 'Rukun Tetangga (RT)', value: '15', icon: 'MapPin', color: 'accent' },
  { label: 'Luas Wilayah', value: '12,45 km²', icon: 'Map', color: 'primary' },
];

export const programList: ProgramItem[] = [
  {
    id: 1,
    judul: 'Program Bank Sampah',
    deskripsi: 'Pengelolaan sampah berbasis komunitas untuk lingkungan bersih dan sehat.',
    icon: 'Recycle',
    progress: 75,
  },
  {
    id: 2,
    judul: 'Program Pemberdayaan UMKM',
    deskripsi: 'Pelatihan dan pendampingan UMKM untuk meningkatkan ekonomi masyarakat.',
    icon: 'TrendingUp',
    progress: 60,
  },
  {
    id: 3,
    judul: 'Program Literasi Digital',
    deskripsi: 'Pelatihan keterampilan digital untuk warga dari berbagai usia.',
    icon: 'Laptop',
    progress: 45,
  },
  {
    id: 4,
    judul: 'Program Pertanian Organik',
    deskripsi: 'Pengenalan dan penerapan teknik budidaya pertanian organik berkelanjutan.',
    icon: 'Sprout',
    progress: 80,
  },
];

export const testimonialList: TestimonialItem[] = [
  {
    id: 1,
    nama: 'H. Abdul Rahman',
    peran: 'Ketua RW 01',
    pesan: 'Pelayanan di Kelurahan Borimasunggu sangat memuaskan. Setiap pengajuan administrasi diproses cepat dan transparan.',
    avatar: 'https://images.pexels.com/photos/220259/pexels-photo-220259.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 2,
    nama: 'Hj. Tenri Ampa',
    peran: 'Kader Posyandu',
    pesan: 'Program kesehatan kelurahan sangat membantu masyarakat. Posyandu aktif dan kader terlatih dengan baik.',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 3,
    nama: 'Andi Setiawan',
    peran: 'Pelaku UMKM',
    pesan: 'Berkat pelatihan digital marketing dari kelurahan, omzet usaha saya meningkat hingga 40% dalam 3 bulan.',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];
