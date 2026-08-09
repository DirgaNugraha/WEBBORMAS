import { supabase } from '../lib/supabaseClient';
import { handleServiceError } from './errorHandler';
import type { PesanKontak } from '../types';

export const pesanKontakService = {
  async getPesanKontakList(): Promise<PesanKontak[]> {
    const { data, error } = await supabase
      .from('pesan_kontak')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      handleServiceError('getPesanKontakList', error);
      return [];
    }
    return data as PesanKontak[];
  },
};
