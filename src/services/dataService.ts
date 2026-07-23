import { supabase } from '../lib/supabaseClient';
import { navItems } from '../data/navigation'; // navigasi menu tetap statis, tidak perlu database
import type {
  NavItem, KelurahanInfo, Pejabat, Potensi, Berita, Agenda,
  GaleriItem, Layanan, StatItem, ProgramItem,
} from '../types';

// Helper internal untuk konversi data Supabase ke tipe Berita di React
function formatBeritaItem(item: any): Berita {
  return {
    ...item,
    isEksternal: item.is_eksternal ?? false,
    namaSumber: item.nama_sumber ?? null,
    linkAsli: item.link_asli ?? null,
  };
}

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

  // --- Fungsi Admin CMS Berita ---
  async tambahBerita(payload: {
    judul: string;
    kategori: string;
    excerpt?: string;
    konten: string;
    gambar?: string;
    penulis?: string;
    isEksternal?: boolean;
    namaSumber?: string;
    linkAsli?: string;
  }): Promise<Berita | null> {
    const { data, error } = await supabase
      .from('berita')
      .insert([
        {
          judul: payload.judul,
          kategori: payload.kategori || 'Umum',
          excerpt: payload.excerpt || null,
          konten: payload.konten,
          gambar: payload.gambar || null,
          penulis: payload.penulis || 'Admin Kelurahan',
          is_eksternal: payload.isEksternal ?? false,
          nama_sumber: payload.isEksternal ? payload.namaSumber : null,
          link_asli: payload.isEksternal ? payload.linkAsli : null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Gagal menambah berita:', error.message);
      throw error;
    }

    return formatBeritaItem(data);
  },

  async updateBerita(
    id: string,
    payload: Partial<{
      judul: string;
      kategori: string;
      excerpt: string;
      konten: string;
      gambar: string;
      penulis: string;
      isEksternal: boolean;
      namaSumber: string;
      linkAsli: string;
    }>
  ): Promise<Berita | null> {
    const updateData: Record<string, any> = {};

    if (payload.judul !== undefined) updateData.judul = payload.judul;
    if (payload.kategori !== undefined) updateData.kategori = payload.kategori;
    if (payload.excerpt !== undefined) updateData.excerpt = payload.excerpt;
    if (payload.konten !== undefined) updateData.konten = payload.konten;
    if (payload.gambar !== undefined) updateData.gambar = payload.gambar;
    if (payload.penulis !== undefined) updateData.penulis = payload.penulis;
    if (payload.isEksternal !== undefined) updateData.is_eksternal = payload.isEksternal;
    if (payload.namaSumber !== undefined) updateData.nama_sumber = payload.namaSumber;
    if (payload.linkAsli !== undefined) updateData.link_asli = payload.linkAsli;

    const { data, error } = await supabase
      .from('berita')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Gagal mengupdate berita:', error.message);
      throw error;
    }

    return formatBeritaItem(data);
  },

  async deleteBerita(id: string): Promise<boolean> {
    const { error } = await supabase.from('berita').delete().eq('id', id);

    if (error) {
      console.error('Gagal menghapus berita:', error.message);
      return false;
    }

    return true;
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