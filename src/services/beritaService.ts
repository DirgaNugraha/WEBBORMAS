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

export const beritaService = {
  async getBeritaList(params: BeritaListParams = {}): Promise<Berita[]> {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .order('tanggal', { ascending: false })
      .limit(params.limit ?? params.perPage ?? 100);

    if (error) {
      handleServiceError('getBeritaList', error);
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

