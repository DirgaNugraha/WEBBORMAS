import { supabase } from '../lib/supabaseClient';
import { handleServiceError } from './errorHandler';
import type { KelurahanInfo, Pejabat } from '../types';

export const profilService = {
  async getKelurahanInfo(): Promise<KelurahanInfo | null> {
    const { data, error } = await supabase
      .from('profil_kelurahan')
      .select('*')
      .maybeSingle();

    if (error) {
      handleServiceError('getKelurahanInfo', error);
      return null;
    }

    if (!data) return null;

    return {
      nama: data.nama ?? '',
      kecamatan: data.kecamatan ?? '',
      kabupaten: data.kabupaten ?? '',
      provinsi: data.provinsi ?? '',
      alamat: data.alamat ?? '',
      kodePos: data.kode_pos ?? '',
      telepon: data.telepon ?? '',
      email: data.email ?? '',
      website: data.website ?? '',
      jamLayanan: data.jam_layanan ?? '',
      jumlahRW: data.jumlah_rw ?? 0,
      jumlahRT: data.jumlah_rt ?? 0,
      jumlahPenduduk: data.jumlah_penduduk ?? 0,
      luasWilayah: data.luas_wilayah ?? '',
      visi: data.visi ?? '',
      misi: data.misi ?? [],
      sejarah: data.sejarah ?? '',
    } as KelurahanInfo;
  },

  async getPejabatList(): Promise<Pejabat[]> {
    const { data, error } = await supabase
      .from('pejabat_kelurahan')
      .select('*')
      .order('urutan', { ascending: true });

    if (error) {
      handleServiceError('getPejabatList', error);
      return [];
    }
    return data as Pejabat[];
  },
};
