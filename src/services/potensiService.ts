import { supabase } from '../lib/supabaseClient';
import { handleServiceError } from './errorHandler';
import type { Potensi, StatItem } from '../types';

export const potensiService = {
  async getPotensiList(): Promise<Potensi[]> {
    const { data, error } = await supabase
      .from('potensi_kelurahan')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      handleServiceError('getPotensiList', error);
      return [];
    }
    return data as Potensi[];
  },

  async getPotensiInfografis(): Promise<StatItem[]> {
    const { data, error } = await supabase
      .from('potensi_infografis')
      .select('*')
      .order('urutan', { ascending: true });

    if (error) {
      handleServiceError('getPotensiInfografis', error);
      return [];
    }
    return data as StatItem[];
  },
};
