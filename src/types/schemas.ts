import { z } from 'zod';

// Schema Berita (kompatibel dengan tipe Berita di types/index.ts)
export const beritaSchema = z.object({
  id: z.union([z.string(), z.number()]),
  slug: z.string().optional().default(''),
  judul: z.string().default(''),
  kategori: z.string().default(''),
  tanggal: z.string().optional().default(''),
  excerpt: z.string().optional(), // boleh null
  konten: z.string().optional().default(''),
  gambar: z.string().optional(),
  penulis: z.string().optional(),
  // Properti frontend (camelCase)
  isEksternal: z.boolean().optional().default(false),
  namaSumber: z.string().optional(),
  linkAsli: z.string().optional(),
});

// Schema Galeri
export const galeriSchema = z.object({
  id: z.union([z.string(), z.number()]),
  judul: z.string().default(''),
  kategori: z.string().default(''),
  gambar: z.string().default(''),
  tanggal: z.string().optional().default(''),
});

// Schema Agenda
export const agendaSchema = z.object({
  id: z.union([z.string(), z.number()]),
  judul: z.string().default(''),
  tanggal: z.string().optional().default(''),
  waktu: z.string().optional().default(''),
  lokasi: z.string().optional().default(''),
  kategori: z.string().optional().default(''),
  deskripsi: z.string().optional().default(''),
  status: z.enum(['upcoming', 'selesai']).default('upcoming'),
});

// Schema Pesan Kontak (tipe penuh / untuk row DB)
export const pesanKontakSchema = z.object({
  id: z.string(),
  nama: z.string().default(''),
  telepon: z.string().optional().default(''),
  subjek: z.string().optional().default(''),
  pesan: z.string().optional().default(''),
  status: z
    .enum(['baru', 'dibaca', 'ditindaklanjuti', 'selesai'])
    .default('baru'),
  catatan_admin: z.string().optional(),
  created_at: z.string().optional().default(''),
});

// Schema input form publik (dipakai validasi sebelum insert)
export const pesanKontakInputSchema = z.object({
  nama: z.string().trim().min(1, 'Nama wajib diisi').max(120),
  telepon: z.string().trim().min(1, 'Nomor WhatsApp wajib diisi'),
  subjek: z.string().trim().min(1, 'Subjek wajib diisi').max(200),
  pesan: z.string().trim().min(1, 'Pesan wajib diisi').max(5000),
});

// Helper aman: memvalidasi data & mengembalikan data bersih, atau fallback
export function safeParse<T>(
  schema: z.ZodTypeAny,
  data: unknown,
  fallback: T
): T {
  const result = schema.safeParse(data);
  return result.success ? (result.data as T) : fallback;
}

