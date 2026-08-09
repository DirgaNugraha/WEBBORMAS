import { supabase } from '../lib/supabaseClient';
import { handleServiceError } from './errorHandler';
import type { GaleriItem } from '../types';

export interface GaleriListParams {
  page?: number;
  perPage?: number;
}

export interface GaleriPageResult {
  data: GaleriItem[];
  total: number;
  hasMore: boolean;
}

export const galeriService = {
  async getGaleriList(params: GaleriListParams = {}): Promise<GaleriItem[]> {
    const { page = 1, perPage = 12 } = params;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('tanggal', { ascending: false })
      .range(from, to);

    if (error) {
      handleServiceError('getGaleriList', error);
      return [];
    }
    return data as GaleriItem[];
  },

  // Ambil satu halaman galeri beserta totalnya (untuk load-more).
  async getGaleriPage(params: GaleriListParams = {}): Promise<GaleriPageResult> {
    const { page = 1, perPage = 12 } = params;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, count, error } = await supabase
      .from('galeri')
      .select('*', { count: 'exact' })
      .order('tanggal', { ascending: false })
      .range(from, to);

    if (error) {
      handleServiceError('getGaleriPage', error);
      return { data: [], total: 0, hasMore: false };
    }

    const mapped = (data as GaleriItem[]) ?? [];
    const total = count ?? mapped.length;
    return {
      data: mapped,
      total,
      hasMore: page * perPage < total,
    };
  },

// Optimasi: hanya memilih kolom 'kategori' (lebih ringan daripada '*').
  // Dedupe dilakukan di client; query tetap diramping karena tidak mengunduh
  // seluruh baris data galeri.
  async getGaleriKategori(): Promise<string[]> {
    const { data, error } = await supabase
      .from('galeri')
      .select('kategori')
      .order('kategori', { ascending: true });

    if (error) {
      handleServiceError('getGaleriKategori', error);
      return ['Semua'];
    }

    const kategoriUnik = Array.from(
      new Set((data ?? []).map((item: { kategori: string }) => item.kategori))
    ).filter(Boolean) as string[];
    return ['Semua', ...kategoriUnik];
  },

  // Galeri terbaru dengan limit (sidebar/beranda)
  async getRecentGaleri(limit: number = 4): Promise<GaleriItem[]> {
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('tanggal', { ascending: false })
      .limit(limit);

    if (error) {
      handleServiceError('getRecentGaleri', error);
      return [];
    }
    return (data as GaleriItem[]) ?? [];
  },
};
