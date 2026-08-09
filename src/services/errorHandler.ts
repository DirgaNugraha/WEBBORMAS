/**
 * Helper terpusat untuk menangani error di lapisan service.
 * Memberikan pola tunggal & konsisten di seluruh service.
 */
export function handleServiceError(context: string, error: unknown): void {
  if (error instanceof Error) {
    console.error(`[${context}]`, error.message);
    return;
  }
  console.error(`[${context}]`, error);
}

