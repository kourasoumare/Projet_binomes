# Correction Campus Quest API (Jour 1)

Cette correction montre une version 100% API (sans CLI) avec persistance JSON.

## Lancer la correction

```bash
node src/correction/server.correction.js
```

## Fichiers de données utilisés

- `data/correction/players.json`
- `data/correction/enigmes.json`
- `data/correction/attempts.json`

## Routes incluses

1. `POST /players`
2. `GET /enigmes` (sans `answer`)
3. `POST /enigmes/:id/answer`
4. `GET /leaderboard`
5. `GET /health`

## Exemple de parcours rapide

```bash
curl http://localhost:3000/health

curl -X POST http://localhost:3000/players \
  -H 'content-type: application/json' \
  -d '{"name":"Alice"}'

curl http://localhost:3000/enigmes

curl -X POST http://localhost:3000/enigmes/e1/answer \
  -H 'content-type: application/json' \
  -d '{"playerId":"<ID_PLAYER>","answer":"echo"}'

curl http://localhost:3000/leaderboard
```
