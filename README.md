## Project setup

```bash
$ cp .env.example .env
```

# Développement

```bash
docker compose -f docker-compose.yml up --build
```

# Production

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

# Arrêter

```bash
docker compose down
```

# Voir les logs

```bash
docker compose logs -f api
```
