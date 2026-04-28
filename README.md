# Gestionnaire de Tournois de Jeux Vidéo

API REST permettant de gérer des tournois de jeux vidéo : création de tournois, inscription des joueurs, gestion des matchs et suivi des résultats.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) >= 24
- [Docker Compose](https://docs.docker.com/compose/) >= 2

## Installation

```bash
cp .env.example .env
```

| Variable | Description | Défaut |
|---|---|---|
| `POSTGRES_USER` | Utilisateur PostgreSQL | `root` |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | `root` |
| `POSTGRES_DB` | Nom de la base de données | `lane` |
| `JWT_SECRET` | Clé secrète pour les tokens JWT | `secretKey` |
| `JWT_EXPIRES_IN` | Durée de validité du JWT (ex: `3600s`) | — |
| `PGADMIN_DEFAULT_EMAIL` | Email pgAdmin | `test@gmail.com` |
| `PGADMIN_DEFAULT_PASSWORD` | Mot de passe pgAdmin | `root` |

## Lancer l'application

### Développement

```bash
docker compose -f docker-compose.yml up --build
```

L'API est accessible sur `http://localhost:3000`.

### Production

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

### Arrêter

```bash
docker compose down
```

### Voir les logs

```bash
docker compose logs -f api
```

## Tests d'intégration

Les tests e2e utilisent une base PostgreSQL isolée lancée via Docker (port 5433, séparée de la base de dev).

**Prérequis :** Docker doit être en cours d'exécution.

```bash
npm run test:e2e
```

Cette commande :
1. Lance un container PostgreSQL de test et attend qu'il soit prêt
2. Exécute tous les tests d'intégration de manière séquentielle
3. Arrête le container une fois les tests terminés

## Routes API

### Authentification

| Méthode | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Inscription d'un joueur | Non |
| `POST` | `/auth/login` | Connexion et récupération du JWT | Non |

### Joueurs

| Méthode | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/players` | Liste des joueurs | JWT |
| `GET` | `/players/:id` | Profil d'un joueur | JWT |
| `GET` | `/players/:id/tournaments` | Tournois d'un joueur | JWT |

### Tournois

| Méthode | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/tournaments` | Liste des tournois (filtrable par `?status=`) | JWT |
| `POST` | `/tournaments` | Créer un tournoi | Admin |
| `GET` | `/tournaments/:id` | Détails d'un tournoi | JWT |
| `PUT` | `/tournaments/:id` | Modifier un tournoi | Admin |
| `DELETE` | `/tournaments/:id` | Supprimer un tournoi | Admin |
| `POST` | `/tournaments/:id/join` | Rejoindre un tournoi | JWT |
| `POST` | `/tournaments/:id/start` | Démarrer un tournoi et générer les matchs | Admin |
| `GET` | `/tournaments/:id/matches` | Liste des matchs d'un tournoi | JWT |

### Matchs

| Méthode | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/matches/:id/result` | Soumettre le résultat d'un match | Admin |

### Jeux

| Méthode | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/games` | Liste des jeux | Non |
| `POST` | `/games` | Ajouter un jeu | Admin |

## Format des réponses

Toutes les réponses sont enveloppées dans un objet commun :

```json
{
  "data": { ... },
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

Les erreurs retournent un code HTTP approprié (400, 401, 403, 404) avec un message descriptif.
