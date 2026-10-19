export interface AssistantResponse {
  cevap: string;
  method?: 'keyword' | 'semantic' | 'no_match';
  source?: string | null;
}

/** Keep transport errors distinct from successful document retrieval. */
export async function askQuestion(
  question: string,
  fetcher: typeof fetch = fetch,
  baseUrl = import.meta.env?.VITE_API_BASE_URL ?? '/api',
): Promise<AssistantResponse> {
  const soru = question.trim();
  if (!soru || soru.length > 1000) throw new Error('Question must contain 1–1000 characters.');
  const response = await fetcher(`${baseUrl.replace(/\/$/, '')}/soru-sor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ soru }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Assistant request failed (${response.status}).`);
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('cevap' in data) || typeof data.cevap !== 'string' || !data.cevap.trim()) {
    throw new Error('Invalid assistant response.');
  }
  return data as AssistantResponse;
}
