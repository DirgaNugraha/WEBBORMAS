import { supabase } from '../lib/supabaseClient';
import { handleServiceError } from './errorHandler';
import type { StatItem, ProgramItem } from '../types';

export const statistikService = {
  async getStatsData(): Promise<StatItem[]> {
    const { data, error } = await supabase
      .from('statistik_beranda')
      .select('*')
      .order('urutan', { ascending: true });

    if (error) {
      handleServiceError('getStatsData', error);
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
      handleServiceError('getProgramList', error);
      return [];
    }
    return data as ProgramItem[];
  },
};
