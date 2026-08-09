import { supabase } from '../lib/supabaseClient';
import { navItems } from '../data/navigation';
import { createBeritaSlug } from '../lib/slug'; // 👈 1. IMPORT HELPER SLUG
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
  // Gunakan createBeritaSlug agar format slug konsisten (judul + tanggal)
  const autoSlug = item.judul
    ? createBeritaSlug(item.judul, item.tanggal)
    : item.id;

return {
    ...item,
    slug: item.slug || autoSlug, // Prioritaskan slug dari DB, fallback ke autoSlug
    gambar: item.gambar ?? undefined,
    isEksternal: item.is_eksternal ?? false,
    namaSumber: item.nama_sumber ?? undefined,
    linkAsli: item.link_asli ?? undefined,
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
      .maybeSingle();

    if (error) {
      console.error('Gagal mengambil profil kelurahan:', error.message);
      return null;
    }

    if (!data) return null;

    return {
      nama: data.nama ?? '',
      kecamatan: data.kecamatan ?? '',
      kabupaten: data.kabupaten ?? '',
      provinsi: data.provinsi ?? '',
      alamat: data.alamat ?? '',
      kodePos: data.kode_pos ?? '',
      telepon: data.telepon ?? '',
      email: data.email ?? '',
      website: data.website ?? '',
      jamLayanan: data.jam_layanan ?? '',
      jumlahRW: data.jumlah_rw ?? 0,
      jumlahRT: data.jumlah_rt ?? 0,
      jumlahPenduduk: data.jumlah_penduduk ?? 0,
      luasWilayah: data.luas_wilayah ?? '',
      visi: data.visi ?? '',
      misi: data.misi ?? [],
      sejarah: data.sejarah ?? '',
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
      .maybeSingle();

    if (error) {
      console.error('Gagal mengambil detail berita:', error.message);
      return undefined;
    }

    return data ? formatBeritaItem(data) : undefined;
  },

  // 🟢 PENCARIAN FLEKSIBEL (SUPPORT SLUG, UUID, & GENERATED SLUG)
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

// 3. Fallback: Coba kecocokan judul yang di-*slugify* langsung di sisi DB.
    //    Query ini dibatasi dan hanya menjangkau data yang relevan, sehingga
    //    lebih efisien daripada menarik seluruh baris tabel `berita`.
    const titleToSlug = slug.replace(/-+/g, ' ');
    const { data: dataByTitle } = await supabase
      .from('berita')
      .select('*')
      .ilike('judul', `%${titleToSlug}%`)
      .limit(1);

    if (dataByTitle && dataByTitle.length > 0) {
      return formatBeritaItem(dataByTitle[0]);
    }

    // 4. Fallback terakhir: cocokkan ID (untuk slug yang ternyata berupa ID numerik).
    const { data: dataById } = await supabase
      .from('berita')
      .select('*')
      .eq('id', slug)
      .maybeSingle();

    return dataById ? formatBeritaItem(dataById) : undefined;
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
// Fungsi khusus untuk mengambil berita dengan limit agar load sidebar jauh lebih cepat
async getRecentBerita(limit: number = 4): Promise<Berita[]> {
    try {
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .order('tanggal', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(formatBeritaItem);
    } catch (err) {
      console.error('Error fetching recent berita:', err);
      return [];
    }
  },

  // Fungsi khusus untuk mengambil galeri dengan limit (dipakai sidebar/beranda)
  async getRecentGaleri(limit: number = 4): Promise<GaleriItem[]> {
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('tanggal', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Gagal mengambil recent galeri:', error.message);
      return [];
    }
    return (data as GaleriItem[]) ?? [];
  },

  // Fungsi khusus untuk mengambil agenda dengan limit (dipakai beranda)
  async getRecentAgenda(limit: number = 3): Promise<Agenda[]> {
    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .eq('status', 'upcoming')
      .order('tanggal', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Gagal mengambil recent agenda:', error.message);
      return [];
    }
    return (data as Agenda[]) ?? [];
  },
};
