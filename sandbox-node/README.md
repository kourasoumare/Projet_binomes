# Corrections - Chapitre 1 (Fondations Node.js)

Ce dossier contient une correction complète de la CLI **Campus Quest** pour les exercices du premier chapitre.

## Structure

- `src/store.js` : lecture/écriture JSON avec gestion `ENOENT`
- `src/game-service.js` : logique métier (joueur, quête, XP, niveau)
- `src/cli.js` : interface en ligne de commande
- `data/quests.json` : quêtes d'exemple
- `data/players.json` : stockage des joueurs

## Lancer en local

```bash
cd docs/nodejs-niveau-1/sandbox-node
npm start -- help
```

## Lancer avec Docker Compose

```bash
cd docs/nodejs-niveau-1/sandbox-node
docker compose up -d --build
```

Puis exécuter les commandes Node dans le conteneur :

```bash
docker compose exec node npm start -- help
docker compose exec node npm start -- list-quests
docker compose exec node npm start -- create-player Alice
```

Arrêter :

```bash
docker compose down
```

## Parcours de validation rapide

```bash
npm start -- reset
npm start -- list-quests
npm start -- create-player Alice
npm start -- add-quest Alice q1
npm start -- complete-quest Alice q1
npm start -- stats Alice
npm start -- leaderboard
```

## Points couverts par la correction

- Initialisation d'un projet Node en ESM
- Lecture/écriture JSON robuste
- Validation des entrées CLI
- Prévention des doublons (pseudo, quête)
- Calcul XP et niveau
- Classement des joueurs
