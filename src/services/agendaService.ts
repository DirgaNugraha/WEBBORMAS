import { supabase } from '../lib/supabaseClient';
import { handleServiceError } from './errorHandler';
import type { Agenda } from '../types';

export interface AgendaListParams {
  page?: number;
  perPage?: number;
}

export interface AgendaPageResult {
  data: Agenda[];
  total: number;
  hasMore: boolean;
}

export const agendaService = {
  async getAgendaList(params: AgendaListParams = {}): Promise<Agenda[]> {
    const { page = 1, perPage = 12 } = params;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .order('tanggal', { ascending: true })
      .range(from, to);

    if (error) {
      handleServiceError('getAgendaList', error);
      return [];
    }
    return data as Agenda[];
  },

  // Ambil satu halaman agenda beserta totalnya (untuk load-more).
  async getAgendaPage(params: AgendaListParams = {}): Promise<AgendaPageResult> {
    const { page = 1, perPage = 12 } = params;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, count, error } = await supabase
      .from('agenda')
      .select('*', { count: 'exact' })
      .order('tanggal', { ascending: true })
      .range(from, to);

    if (error) {
      handleServiceError('getAgendaPage', error);
      return { data: [], total: 0, hasMore: false };
    }

    const mapped = (data as Agenda[]) ?? [];
    const total = count ?? mapped.length;
    return {
      data: mapped,
      total,
      hasMore: page * perPage < total,
    };
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
