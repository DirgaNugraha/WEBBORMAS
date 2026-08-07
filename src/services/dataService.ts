import { supabase } from '../lib/supabaseClient';
import { navItems } from '../data/navigation';
import type {
  NavItem,
  KelurahanInfo,
  Pejabat,
  Potensi,
  Berita,
  Agenda,
  GaleriItem,
  Layanan,
  StatItem,
  ProgramItem,
} from '../types';

// Helper internal untuk konversi data Supabase ke tipe Berita di React
function formatBeritaItem(item: any): Berita {
  // Generate slug otomatis dari judul jika di DB belum ada/kosong
  const autoSlug = item.judul
    ? item.judul
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    : item.id;

  return {
    ...item,
    slug: item.slug || autoSlug, // Prioritaskan slug dari DB, fallback ke autoSlug
    isEksternal: item.is_eksternal ?? false,
    namaSumber: item.nama_sumber ?? null,
    linkAsli: item.link_asli ?? null,
  };
}

// Regex checker untuk mendeteksi apakah string berformat UUID
const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const dataService = {
  // ============================================================
  // NAVIGASI
  // ============================================================
  getNavItems(): NavItem[] {
    return navItems;
  },

  // ============================================================
  // PROFIL KELURAHAN
  // ============================================================
  async getKelurahanInfo(): Promise<KelurahanInfo | null> {
    const { data, error } = await supabase
      .from('profil_kelurahan')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Gagal mengambil profil kelurahan:', error.message);
      return null;
    }

    return {
      kecamatan: data.kecamatan,
      kabupaten: data.kabupaten,
      alamat: data.alamat,
      telepon: data.telepon,
      email: data.email,
      jamLayanan: data.jam_layanan,
      jumlahPenduduk: data.jumlah_penduduk,
      luasWilayah: data.luas_wilayah,
      visi: data.visi,
      misi: data.misi ?? [],
      sejarah: data.sejarah,
    } as KelurahanInfo;
  },

  // ============================================================
  // PEJABAT / STRUKTUR ORGANISASI
  // ============================================================
  async getPejabatList(): Promise<Pejabat[]> {
    const { data, error } = await supabase
      .from('pejabat_kelurahan')
      .select('*')
      .order('urutan', { ascending: true });

    if (error) {
      console.error('Gagal mengambil daftar pejabat:', error.message);
      return [];
    }
    return data as Pejabat[];
  },

  // ============================================================
  // POTENSI KELURAHAN
  // ============================================================
  async getPotensiList(): Promise<Potensi[]> {
    const { data, error } = await supabase
      .from('potensi_kelurahan')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal mengambil daftar potensi:', error.message);
      return [];
    }
    return data as Potensi[];
  },

  // ============================================================
  // BERITA (Public View & Admin CMS)
  // ============================================================
  async getBeritaList(): Promise<Berita[]> {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Gagal mengambil daftar berita:', error.message);
      return [];
    }

    return (data || []).map(formatBeritaItem);
  },

  async getBeritaById(id: string): Promise<Berita | undefined> {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Gagal mengambil detail berita:', error.message);
      return undefined;
    }

    return formatBeritaItem(data);
  },

  // 🟢 PENCARIAN FLEKSIBEL (SUPPORT SLUG DAN UUID)
  async getBeritaBySlug(slug: string): Promise<Berita | undefined> {
    // 1. Jika URL berupa UUID, query langsung via ID
    if (isUUID(slug)) {
      return this.getBeritaById(slug);
    }

    // 2. Coba query ke database berdasarkan kolom 'slug'
    const { data: dataBySlug } = await supabase
      .from('berita')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (dataBySlug) {
      return formatBeritaItem(dataBySlug);
    }

    // 3. Fallback: Ambil semua data lalu cari berita yang slug hasil konversi judulnya cocok
    const allBerita = await this.getBeritaList();
    return allBerita.find((item) => item.slug === slug);
  },

  // ============================================================
  // AGENDA
  // ============================================================
  async getAgendaList(): Promise<Agenda[]> {
    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .order('tanggal', { ascending: true });

    if (error) {
      console.error('Gagal mengambil daftar agenda:', error.message);
      return [];
    }
    return data as Agenda[];
  },

  async getUpcomingAgenda(): Promise<Agenda[]> {
    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .eq('status', 'upcoming')
      .order('tanggal', { ascending: true });

    if (error) {
      console.error('Gagal mengambil agenda mendatang:', error.message);
      return [];
    }
    return data as Agenda[];
  },

  // ============================================================
  // GALERI
  // ============================================================
  async getGaleriList(): Promise<GaleriItem[]> {
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Gagal mengambil galeri:', error.message);
      return [];
    }
    return data as GaleriItem[];
  },

  async getGaleriKategori(): Promise<string[]> {
    const { data, error } = await supabase.from('galeri').select('kategori');

    if (error) {
      console.error('Gagal mengambil kategori galeri:', error.message);
      return ['Semua'];
    }
    const kategoriUnik = Array.from(
      new Set((data ?? []).map((item: { kategori: string }) => item.kategori))
    ) as string[];
    return ['Semua', ...kategoriUnik];
  },

  // ============================================================
  // LAYANAN PUBLIK
  // ============================================================
  async getLayananList(): Promise<Layanan[]> {
    const { data, error } = await supabase
      .from('layanan_publik')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Gagal mengambil daftar layanan:', error.message);
      return [];
    }
    return data as Layanan[];
  },

  async getLayananById(id: string): Promise<Layanan | undefined> {
    const { data, error } = await supabase
      .from('layanan_publik')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Gagal mengambil detail layanan:', error.message);
      return undefined;
    }
    return data as Layanan;
  },

  // ============================================================
  // BERANDA: STATISTIK, PROGRAM, TESTIMONI
  // ============================================================
  async getStatsData(): Promise<StatItem[]> {
    const { data, error } = await supabase
      .from('statistik_beranda')
      .select('*')
      .order('urutan', { ascending: true });

    if (error) {
      console.error('Gagal mengambil statistik beranda:', error.message);
      return [];
    }
    return data as StatItem[];
  },

  async getProgramList(): Promise<ProgramItem[]> {
    const { data, error } = await supabase
      .from('program_kelurahan')
      .select('*')
      .order('urutan', { ascending: true });

    if (error) {
      console.error('Gagal mengambil daftar program:', error.message);
      return [];
    }
    return data as ProgramItem[];
  },

  async getPotensiInfografis(): Promise<StatItem[]> {
    const { data, error } = await supabase
      .from('potensi_infografis')
      .select('*')
      .order('urutan', { ascending: true });

    if (error) {
      console.error('Gagal mengambil infografis potensi:', error.message);
      return [];
    }
    return data as StatItem[];
  },
};