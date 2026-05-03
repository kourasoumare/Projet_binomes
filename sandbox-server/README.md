# Sandbox Docker - Node.js

## Lancement

```bash
docker compose up -d --build
```

## Vérification

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/version
```

## Arrêt

```bash
docker compose down
```

## Logs

```bash
docker compose logs -f
```
