// ESM (package.json com "type":"module")
const BASE = 'https://api.football-data.org/v4';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Fetch a equipa e devolve { id, name, players[] } ou null se 404.
 * Faz retry simples em 429/5xx (para lidar com rate limits).
 */
export async function fetchTeam(id, apiKey, { retries = 3, delayMs = 1000 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`${BASE}/teams/${id}`, {
      headers: { 'X-Auth-Token': apiKey }
    });

    if (res.status === 404) return null; // equipa inexistente → ignora
    if (res.ok) {
      const data = await res.json();
      return {
        id: data.id,
        name: data.name,
        players: Array.isArray(data.squad) ? data.squad.map(p => p.name) : []
      };
    }

    // 429 (rate limit) ou 5xx → backoff
    if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
      if (attempt === retries) throw new Error(`HTTP ${res.status} after retries`);
      await sleep(delayMs * (attempt + 1));
      continue;
    }

    // outros erros → falha logo
    const msg = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${msg}`);
  }
}
