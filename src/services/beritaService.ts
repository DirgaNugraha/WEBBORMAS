import { supabase } from '../lib/supabaseClient';
import { createBeritaSlug } from '../lib/slug';
import { isUUID } from './helpers';
import { handleServiceError } from './errorHandler';
import type { Berita } from '../types';

// Helper internal untuk konversi data Supabase ke tipe Berita di React
function formatBeritaItem(item: any): Berita {
  const autoSlug = item.judul
    ? createBeritaSlug(item.judul, item.tanggal)
    : item.id;

  return {
    ...item,
    slug: item.slug || autoSlug,
    gambar: item.gambar ?? undefined,
    isEksternal: item.is_eksternal ?? false,
    namaSumber: item.nama_sumber ?? undefined,
    linkAsli: item.link_asli ?? undefined,
  };
}

export interface BeritaListParams {
  page?: number;
  perPage?: number;
  limit?: number;
}

export interface BeritaPageResult {
  data: Berita[];
  total: number;
  hasMore: boolean;
}

export const beritaService = {
  async getBeritaList(params: BeritaListParams = {}): Promise<Berita[]> {
    const { page = 1, perPage = 12, limit } = params;

    // Jika `limit` diberikan, gunakan limit sederhana (untuk sidebar/beranda).
    if (limit) {
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .order('tanggal', { ascending: false })
        .limit(limit);

      if (error) {
        handleServiceError('getBeritaList', error);
        return [];
      }
      return (data || []).map(formatBeritaItem);
    }

    // Pagination default (load-more): pakai .range() agar efisien di data besar.
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .order('tanggal', { ascending: false })
      .range(from, to);

    if (error) {
      handleServiceError('getBeritaList', error);
      return [];
    }

    return (data || []).map(formatBeritaItem);
  },

  // Ambil satu halaman berita beserta totalnya (untuk load-more).
  async getBeritaPage(params: BeritaListParams = {}): Promise<BeritaPageResult> {
    const { page = 1, perPage = 12 } = params;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Pakai count: 'exact' agar tahu total & apakah masih ada data berikutnya.
    const { data, count, error } = await supabase
      .from('berita')
      .select('*', { count: 'exact' })
      .order('tanggal', { ascending: false })
      .range(from, to);

    if (error) {
      handleServiceError('getBeritaPage', error);
      return { data: [], total: 0, hasMore: false };
    }

    const mapped = (data || []).map(formatBeritaItem);
    const total = count ?? mapped.length;
    return {
      data: mapped,
      total,
      hasMore: page * perPage < total,
    };
  },

  async getBeritaById(id: string): Promise<Berita | undefined> {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      handleServiceError('getBeritaById', error);
      return undefined;
    }

    return data ? formatBeritaItem(data) : undefined;
  },

  // Pencarian fleksibel (slug, UUID, generated slug)
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

    // 3. Fallback: cocokkan ID (untuk slug yang ternyata berupa ID numerik)
    const { data: dataById } = await supabase
      .from('berita')
      .select('*')
      .eq('id', slug)
      .maybeSingle();

    return dataById ? formatBeritaItem(dataById) : undefined;
  },

  // Berita terbaru dengan limit (untuk sidebar/beranda)
  async getRecentBerita(limit: number = 4): Promise<Berita[]> {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .order('tanggal', { ascending: false })
      .limit(limit);

    if (error) {
      handleServiceError('getRecentBerita', error);
      return [];
    }

    return (data || []).map(formatBeritaItem);
  },
};

