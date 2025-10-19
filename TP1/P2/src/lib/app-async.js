import path from 'node:path';




import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fetchTeam } from './footballData.js';

const [,, inPath = 'TP1/P2/data/teams.json', outPath = 'TP1/P2/out/players.json'] = process.argv;
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

if (!API_KEY) {
  console.error('Erro: defina FOOTBALL_DATA_API_KEY no ambiente.');
  process.exit(1);
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const txt = await readFile(inPath, 'utf8');
  const ids = (JSON.parse(txt)['teams-ids']) ?? [];

  const out = { teams: [] };
  for (const id of ids) {
    const team = await fetchTeam(id, API_KEY);
    if (team) out.teams.push(team);
    await sleep(800); // sequência + pausa => respeitar rate limits
  }

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`OK: ${outPath}`);
}

main().catch(e => {
  console.error('Falhou:', e.message);
  process.exit(1);
});
