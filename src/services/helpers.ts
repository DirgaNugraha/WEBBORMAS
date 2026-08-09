// Regex checker untuk mendeteksi apakah string berformat UUID
export const isUUID = (str: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

// Konversi nilai null/undefined menjadi undefined (kompatibel atribut JSX)
export const toUndefined = <T>(value: T | null | undefined): T | undefined =>
  value ?? undefined;

