import { supabase } from '../lib/supabaseClient';
import { navItems } from '../data/navigation'; // navigasi menu tetap statis, tidak perlu database
import type {
  NavItem, KelurahanInfo, Pejabat, Potensi, Berita, Agenda,
  GaleriItem, Layanan, StatItem, ProgramItem, TestimonialItem,
} from '../types';
 
export const dataService = {
  // ============================================================
  // NAVIGASI — tetap statis (menu tidak perlu diambil dari DB)
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
 
    // Mapping snake_case (database) -> camelCase (dipakai di komponen)
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
  // BERITA
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
    return data as Berita[];
  },
 
  // PERHATIAN: id sekarang bertipe string (uuid), bukan number
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
    return data as Berita;
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
    const { data, error } = await supabase
      .from('galeri')
      .select('kategori');
 
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
 
  // PERHATIAN: id sekarang bertipe string (uuid), bukan number
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
 
  async getTestimonialList(): Promise<TestimonialItem[]> {
    const { data, error } = await supabase
      .from('testimoni')
      .select('*')
      .order('urutan', { ascending: true });
 
    if (error) {
      console.error('Gagal mengambil testimoni:', error.message);
      return [];
    }
    return data as TestimonialItem[];
  },
};