import path from 'node:path';




import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fetchTeam } from './footballData.js';

const [,, inPath = 'TP1/P2/data/teams.json', outPath = 'TP1/P2/out/players.json'] = process.argv;
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

if (!API_KEY) {
  console.error('Erro: defina FOOTBALL_DATA_API_KEY no ambiente.');
  process.exit(1);
}

readFile(inPath, 'utf8')
  .then(txt => JSON.parse(txt))
  .then(json => {
    const ids = json['teams-ids'] ?? [];
    // corrida SEQUENCIAL para respeitar rate limits
    const out = { teams: [] };

    return ids.reduce((chain, id) => chain
      .then(() => fetchTeam(id, API_KEY))
      .then(team => {
        if (team) out.teams.push(team); // ignora 404
        // pequena pausa entre pedidos
        return new Promise(r => setTimeout(r, 800));
      })
    , Promise.resolve()).then(() => out);
  })
  .then(async (out) => {
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, JSON.stringify(out, null, 2), 'utf8');
    console.log(`OK: ${outPath}`);
  })
  .catch(err => {
    console.error('Falhou:', err.message);
    process.exit(1);
  });
