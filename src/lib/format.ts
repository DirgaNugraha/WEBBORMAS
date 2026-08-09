const ID_LOCALE = 'id-ID';

const MONTHS_SHORT: Record<string, string> = {};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(ID_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(ID_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getDayNumber(dateStr: string): string {
  return String(new Date(dateStr).getDate());
}

export function getMonthShort(dateStr: string): string {
  const date = new Date(dateStr);
  const key = `${date.getMonth()}-${date.getFullYear()}`;
  if (!MONTHS_SHORT[key]) {
    MONTHS_SHORT[key] = date
      .toLocaleDateString(ID_LOCALE, { month: 'short' })
      .replace('.', '');
  }
  return MONTHS_SHORT[key];
}

export function formatNumber(n: number): string {
  return n.toLocaleString(ID_LOCALE);
}

// ============================================================
// HELPER NOMOR WHATSAPP INDONESIA
// ============================================================

/**
 * Membersihkan & mengonversi nomor WhatsApp ke format internasional Indonesia (62).
 * Aturan:
 *  - Hanya karakter digit yang dipertahankan.
 *  - '081234567890'  -> '6281234567890' (awalan 0 diganti 62)
 *  - '+6281234567890' -> '6281234567890'
 *  - '6281234567890'  -> '6281234567890' (dibiarkan)
 *  - '6281234567'     -> '81234567' (awalan 62 di-strip, lalu ditambah 62 lagi)
 */
export function sanitizeWaNumber(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';

  // Buang awalan 62/8x agar bersih, lalu normalisasi ulang ke 62
  let normalized = digits;
  if (normalized.startsWith('62')) {
    normalized = normalized.slice(2);
  } else if (normalized.startsWith('0')) {
    normalized = normalized.slice(1);
  }

  return `62${normalized}`;
}

/**
 * Validasi nomor WhatsApp: minimal 10 digit setelah normalisasi,
 * dan hanya berisi angka.
 */
export function validateWaNumber(input: string): boolean {
  const normalized = sanitizeWaNumber(input);
  return /^\d+$/.test(normalized) && normalized.length >= 10;
}

/**
 * Membangun URL WhatsApp resmi (wa.me) dengan pesan terformat.
 */
export function buildWaLink(
  telepon: string,
  nama: string,
  subjek: string
): string {
  const number = sanitizeWaNumber(telepon);
  const message =
    `Halo ${nama}, terima kasih telah menghubungi Pemerintah Kelurahan. ` +
    `Mengenai laporan Anda: "${subjek}", kami akan segera menindaklanjuti.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

