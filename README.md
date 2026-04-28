# Tournament API

API REST de gestion de tournois de jeux vidéo, développée avec NestJS, TypeORM et PostgreSQL.

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose

## Installation

```bash
cp .env.example .env
```

## Variables d'environnement

| Variable              | Description                        | Valeur par défaut |
|-----------------------|------------------------------------|-------------------|
| `POSTGRES_USER`       | Utilisateur PostgreSQL             | `root`            |
| `POSTGRES_PASSWORD`   | Mot de passe PostgreSQL            | `root`            |
| `POSTGRES_DB`         | Nom de la base de données          | `lane`            |
| `DATABASE_HOST`       | Hôte de la base de données         | `postgres`        |
| `DATABASE_PORT`       | Port PostgreSQL                    | `5432`            |
| `DATABASE_USER`       | Utilisateur pour l'API             | `root`            |
| `DATABASE_PASSWORD`   | Mot de passe pour l'API            | `root`            |
| `DATABASE_NAME`       | Nom de la base pour l'API          | `lane`            |
| `JWT_SECRET`          | Clé secrète pour les tokens JWT    | `secretKey`       |
| `PGADMIN_DEFAULT_EMAIL`    | Email de connexion pgAdmin    | —                 |
| `PGADMIN_DEFAULT_PASSWORD` | Mot de passe pgAdmin          | —                 |

## Lancer le projet

### Développement

```bash
docker compose -f docker-compose.yml up --build
```

L'API est disponible sur `http://localhost:3000`  
La documentation Swagger est disponible sur `http://localhost:3000/api`  
pgAdmin est disponible sur `http://localhost:8080`

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

## Routes HTTP

### Authentification

| Méthode | Route            | Auth | Description                      |
|---------|------------------|------|----------------------------------|
| POST    | /auth/register   | —    | Inscription d'un joueur          |
| POST    | /auth/login      | —    | Connexion et récupération du JWT |

**Exemple register :**
```json
POST /auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "avatar": "https://example.com/avatar.png"
}
```

**Exemple login :**
```json
POST /auth/login
{
  "username": "johndoe",
  "password": "password123"
}
```
Réponse : `{ "access_token": "eyJ..." }`

> Pour les routes protégées, ajouter le header : `Authorization: Bearer <access_token>`

---

### Joueurs

| Méthode | Route                     | Auth  | Description                        |
|---------|---------------------------|-------|------------------------------------|
| GET     | /players                  | JWT   | Liste de tous les joueurs          |
| GET     | /players/:id              | JWT   | Profil d'un joueur                 |
| GET     | /players/:id/tournaments  | JWT   | Tournois auxquels un joueur participe |
| PATCH   | /players/:id/promote      | Admin | Promouvoir un joueur en admin      |

---

### Tournois

| Méthode | Route                    | Auth  | Description                              |
|---------|--------------------------|-------|------------------------------------------|
| GET     | /tournaments             | JWT   | Liste des tournois (filtrable par statut)|
| GET     | /tournaments/:id         | JWT   | Détails d'un tournoi                     |
| POST    | /tournaments             | Admin | Créer un tournoi                         |
| PUT     | /tournaments/:id         | Admin | Modifier un tournoi                      |
| DELETE  | /tournaments/:id         | Admin | Supprimer un tournoi                     |
| POST    | /tournaments/:id/join    | JWT   | S'inscrire à un tournoi                  |
| POST    | /tournaments/:id/start   | Admin | Démarrer un tournoi (génère les matchs)  |
| GET     | /tournaments/:id/matches | JWT   | Liste des matchs d'un tournoi            |

**Exemple créer un tournoi :**
```json
POST /tournaments
{
  "name": "Tournoi Spring 2026",
  "gameId": "uuid-du-jeu",
  "maxPlayers": 8,
  "startDate": "2026-05-01T10:00:00Z"
}
```

**Filtrer par statut :**
```
GET /tournaments?status=pending
GET /tournaments?status=in_progress
GET /tournaments?status=completed
```

**S'inscrire à un tournoi :**
```json
POST /tournaments/:id/join
{
  "playerId": "uuid-du-joueur"
}
```

---

### Matchs

| Méthode | Route               | Auth  | Description                   |
|---------|---------------------|-------|-------------------------------|
| POST    | /matches/:id/result | Admin | Soumettre le résultat d'un match |

**Exemple soumettre un résultat :**
```json
POST /matches/:id/result
{
  "winnerId": "uuid-du-gagnant",
  "score": "3-1"
}
```

---

### Jeux

| Méthode | Route   | Auth  | Description          |
|---------|---------|-------|----------------------|
| GET     | /games  | —     | Liste de tous les jeux |
| POST    | /games  | Admin | Ajouter un jeu       |

**Exemple ajouter un jeu :**
```json
POST /games
{
  "name": "League of Legends",
  "publisher": "Riot Games",
  "releaseDate": "2009-10-27",
  "genre": "MOBA"
}
```

---

## Statuts des tournois

| Statut        | Description                            |
|---------------|----------------------------------------|
| `pending`     | En attente d'inscriptions              |
| `in_progress` | Tournoi démarré, matchs en cours       |
| `completed`   | Tournoi terminé                        |

## Rôles utilisateurs

| Rôle    | Description                                        |
|---------|----------------------------------------------------|
| `user`  | Joueur standard — peut s'inscrire aux tournois     |
| `admin` | Peut créer/modifier/supprimer tournois et jeux, soumettre les résultats des matchs |

Un utilisateur peut être promu admin via `PATCH /players/:id/promote` (réservé aux admins).

## Tests

```bash
# Tests unitaires
docker compose exec api npm run test

# Tests avec couverture
docker compose exec api npm run test:cov

# Tests e2e
docker compose exec api npm run test:e2e
```