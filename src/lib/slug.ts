const NAMA_BULAN = [
  'januari', 'februari', 'maret', 'april', 'mei', 'juni',
  'juli', 'agustus', 'september', 'oktober', 'november', 'desember',
];

/**
 * Mengubah teks judul menjadi slug URL-friendly.
 * Contoh: "Pangkep Mabulo Diharapkan Dongkrak Ekonomi"
 *      -> "pangkep-mabulo-diharapkan-dongkrak-ekonomi"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // hapus diakritik/aksen
    .replace(/[^a-z0-9\s-]/g, '') // hapus karakter selain huruf/angka/spasi/strip
    .trim()
    .replace(/\s+/g, '-') // spasi jadi strip
    .replace(/-+/g, '-'); // rapikan strip ganda
}

/**
 * Mengubah tanggal menjadi bagian slug, mis. "2026-07-08" -> "8-juli-2026".
 * Menerima format tanggal apa pun yang bisa dibaca oleh `new Date()`.
 */
export function dateToSlug(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  const tanggal = date.getDate();
  const bulan = NAMA_BULAN[date.getMonth()];
  const tahun = date.getFullYear();
  return `${tanggal}-${bulan}-${tahun}`;
}

/**
 * Membuat slug unik untuk sebuah berita: gabungan slug judul + tanggal.
 * Contoh: "pangkep-mabulo-diharapkan-dongkrak-ekonomi-8-juli-2026"
 */
export function createBeritaSlug(judul: string, tanggal: string): string {
  const judulSlug = slugify(judul);
  const tanggalSlug = dateToSlug(tanggal);
  return tanggalSlug ? `${judulSlug}-${tanggalSlug}` : judulSlug;
}