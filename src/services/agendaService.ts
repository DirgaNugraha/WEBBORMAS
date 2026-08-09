import { supabase } from '../lib/supabaseClient';
import { handleServiceError } from './errorHandler';
import type { Agenda } from '../types';

export const agendaService = {
  async getAgendaList(): Promise<Agenda[]> {
    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .order('tanggal', { ascending: true });

    if (error) {
      handleServiceError('getAgendaList', error);
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
      handleServiceError('getUpcomingAgenda', error);
      return [];
    }
    return data as Agenda[];
  },

  // Agenda mendatang dengan limit (beranda)
  async getRecentAgenda(limit: number = 3): Promise<Agenda[]> {
    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .eq('status', 'upcoming')
      .order('tanggal', { ascending: true })
      .limit(limit);

    if (error) {
      handleServiceError('getRecentAgenda', error);
      return [];
    }
    return (data as Agenda[]) ?? [];
  },
};
