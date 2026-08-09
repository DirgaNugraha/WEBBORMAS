import { supabase } from '../lib/supabaseClient';
import { handleServiceError } from './errorHandler';
import type { Layanan } from '../types';

export const layananService = {
  async getLayananList(): Promise<Layanan[]> {
    const { data, error } = await supabase
      .from('layanan_publik')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      handleServiceError('getLayananList', error);
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
      handleServiceError('getLayananById', error);
      return undefined;
    }
    return data as Layanan;
  },
};
