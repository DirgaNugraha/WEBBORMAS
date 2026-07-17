import { supabase } from '../lib/supabaseClient';

// Nama semua tabel yang dikelola lewat admin (dipakai sebagai type guard)
export type AdminTable =
  | 'profil_kelurahan'
  | 'pejabat_kelurahan'
  | 'statistik_beranda'
  | 'program_kelurahan'
  | 'testimoni'
  | 'berita'
  | 'agenda'
  | 'galeri'
  | 'potensi_kelurahan'
  | 'potensi_infografis'
  | 'layanan_publik'
  | 'pesan_kontak';

export const adminService = {
  // Ambil semua baris dari sebuah tabel, opsional urut & terbaru dulu
  async list<T = any>(table: AdminTable, orderBy = 'created_at', ascending = false): Promise<T[]> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending });

    if (error) {
      console.error(`Gagal mengambil data ${table}:`, error.message);
      return [];
    }
    return data as T[];
  },

  async getById<T = any>(
  table: AdminTable,
  id: number | string
): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Gagal mengambil data ${table}:`, error.message);
    return null;
  }

  return data as T;
},

async create(
  table: AdminTable,
  payload: Record<string, any>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from(table)
    .insert(payload);

  if (error) {
    console.error(`Gagal membuat data ${table}:`, error.message);
    return { error: error.message };
  }

  return { error: null };
},

async update(
  table: AdminTable,
  id: number | string,
  payload: Record<string, any>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from(table)
    .update(payload)
    .eq('id', id);

  if (error) {
    console.error(`Gagal mengubah data ${table}:`, error.message);
    return { error: error.message };
  }

  return { error: null };
},

async remove(
  table: AdminTable,
  id: number | string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Gagal menghapus data ${table}:`, error.message);
    return { error: error.message };
  }

  return { error: null };
},

  // Upload gambar ke Supabase Storage, bucket "public-images"
  // Kembalikan public URL untuk disimpan ke kolom gambar/foto/avatar
  async uploadImage(file: File, folder: string): Promise<{ url: string | null; error: string | null }> {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('public-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.error('Gagal upload gambar:', uploadError.message);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from('public-images').getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
  },

  // Hitung jumlah baris di sebuah tabel (untuk dashboard)
  async count(table: AdminTable, filter?: { column: string; value: any }): Promise<number> {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    if (filter) query = query.eq(filter.column, filter.value);

    const { count, error } = await query;
    if (error) {
      console.error(`Gagal menghitung ${table}:`, error.message);
      return 0;
    }
    return count ?? 0;
  },
};