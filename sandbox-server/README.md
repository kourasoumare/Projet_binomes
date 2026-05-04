# Sandbox Docker - Node.js (JSON Hello)

## Lancement

```bash
docker compose down -v       # stoppe et supprime les conteneurs existants
docker compose up -d --build
```

## Vérification

```bash
curl http://localhost:3000/
```

Réponse attendue:

```json
{"hello":"world"}
```

## Arrêt

```bash
docker compose down
```

## Logs

```bash
docker compose logs -f
```


## Commandes 

```bash
docker compose down        # stoppe et supprime les conteneurs existants
docker compose build --no-cache  # rebuild l’image en prenant en compte tes modifs
docker compose up -d      # relance les conteneurs en arrière-plan
```
