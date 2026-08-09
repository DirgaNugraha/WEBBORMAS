import { supabase } from '../lib/supabaseClient';
import { handleServiceError } from './errorHandler';
import type { GaleriItem } from '../types';

export const galeriService = {
  async getGaleriList(): Promise<GaleriItem[]> {
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      handleServiceError('getGaleriList', error);
      return [];
    }
    return data as GaleriItem[];
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
