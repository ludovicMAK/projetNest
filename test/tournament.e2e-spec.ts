import type { INestApplication } from '@nestjs/common';
import {
  clearDatabase,
  createTestApp,
  e2eRequest,
  promoteToAdmin,
  responseData,
} from './helpers/test-app';

interface PlayerData {
  id: string;
}

interface RegisterData {
  user: PlayerData;
}

interface LoginData {
  access_token: string;
}

interface EntityWithId {
  id: string;
}

interface TournamentData {
  id: string;
  name: string;
  status: string;
  players?: PlayerData[];
}

describe('Tournaments (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let adminId: string;
  let userToken: string;
  let userId: string;
  let gameId: string;
  let tournamentId: string;

  beforeAll(async () => {
    app = await createTestApp();
    await clearDatabase(app);

    const adminRegister = await e2eRequest(app).post('/auth/register').send({
      username: 'admin',
      email: 'admin@test.com',
      password: 'Admin1234!',
      avatar: 'https://example.com/admin.png',
    });
    adminId = responseData<RegisterData>(adminRegister).user.id;
    await promoteToAdmin(app, adminId);

    const adminLogin = await e2eRequest(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'Admin1234!' });
    adminToken = responseData<LoginData>(adminLogin).access_token;

    const userRegister = await e2eRequest(app).post('/auth/register').send({
      username: 'user',
      email: 'user@test.com',
      password: 'User1234!',
      avatar: 'https://example.com/user.png',
    });
    userId = responseData<RegisterData>(userRegister).user.id;

    const userLogin = await e2eRequest(app)
      .post('/auth/login')
      .send({ username: 'user', password: 'User1234!' });
    userToken = responseData<LoginData>(userLogin).access_token;

    const gameRes = await e2eRequest(app)
      .post('/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Counter-Strike 2',
        publisher: 'Valve',
        releaseDate: '2023-09-27',
        genre: 'FPS',
      });
    gameId = responseData<EntityWithId>(gameRes).id;

    const tournamentRes = await e2eRequest(app)
      .post('/tournaments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Tournoi Principal',
        gameId,
        maxPlayers: 4,
        startDate: '2026-12-01',
      });
    tournamentId = responseData<EntityWithId>(tournamentRes).id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /tournaments', () => {
    it('200 - retourne la liste des tournois', async () => {
      const res = await e2eRequest(app)
        .get('/tournaments')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
      const data = responseData<TournamentData[]>(res);

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(1);
    });

    it('200 - filtre par statut pending', async () => {
      const res = await e2eRequest(app)
        .get('/tournaments?status=pending')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
      const data = responseData<TournamentData[]>(res);

      expect(Array.isArray(data)).toBe(true);
      data.forEach((t) => {
        expect(t.status).toBe('pending');
      });
    });
  });

  describe('GET /tournaments/:id', () => {
    it('200 - retourne le tournoi', async () => {
      const res = await e2eRequest(app)
        .get(`/tournaments/${tournamentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
      const data = responseData<TournamentData>(res);

      expect(data.id).toBe(tournamentId);
      expect(data.name).toBe('Tournoi Principal');
    });

    it('404 - tournoi inexistant', () => {
      return e2eRequest(app)
        .get('/tournaments/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('POST /tournaments', () => {
    it('201 - admin crée un tournoi', async () => {
      const res = await e2eRequest(app)
        .post('/tournaments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Autre Tournoi',
          gameId,
          maxPlayers: 8,
          startDate: '2026-12-15',
        })
        .expect(201);
      const data = responseData<TournamentData>(res);

      expect(data.id).toBeDefined();
      expect(data.status).toBe('pending');
    });

    it('403 - un user ne peut pas créer un tournoi', () => {
      return e2eRequest(app)
        .post('/tournaments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Test', gameId, maxPlayers: 4, startDate: '2026-12-01' })
        .expect(403);
    });

    it('401 - non authentifié', () => {
      return e2eRequest(app)
        .post('/tournaments')
        .send({ name: 'Test', gameId, maxPlayers: 4, startDate: '2026-12-01' })
        .expect(401);
    });

    it('400 - données invalides', () => {
      return e2eRequest(app)
        .post('/tournaments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test', maxPlayers: 1 })
        .expect(400);
    });
  });

  describe('PUT /tournaments/:id', () => {
    it('200 - admin modifie un tournoi', async () => {
      const res = await e2eRequest(app)
        .put(`/tournaments/${tournamentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Tournoi Modifié' })
        .expect(200);
      const data = responseData<TournamentData>(res);

      expect(data.name).toBe('Tournoi Modifié');
    });

    it('403 - un user ne peut pas modifier un tournoi', () => {
      return e2eRequest(app)
        .put(`/tournaments/${tournamentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Hack' })
        .expect(403);
    });
  });

  describe('POST /tournaments/:id/join', () => {
    it('201 - un user rejoint le tournoi', async () => {
      const res = await e2eRequest(app)
        .post(`/tournaments/${tournamentId}/join`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ playerId: userId })
        .expect(201);
      const data = responseData<TournamentData>(res);

      const players = data.players ?? [];
      expect(players.some((p) => p.id === userId)).toBe(true);
    });

    it('400 - joueur déjà inscrit', () => {
      return e2eRequest(app)
        .post(`/tournaments/${tournamentId}/join`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ playerId: userId })
        .expect(400);
    });

    it('400 - playerId invalide (non UUID)', () => {
      return e2eRequest(app)
        .post(`/tournaments/${tournamentId}/join`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ playerId: 'not-a-uuid' })
        .expect(400);
    });
  });

  describe('GET /tournaments/:id/matches', () => {
    it('200 - retourne les matchs du tournoi (vide avant démarrage)', async () => {
      const res = await e2eRequest(app)
        .get(`/tournaments/${tournamentId}/matches`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
      const data = responseData<unknown[]>(res);

      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('DELETE /tournaments/:id', () => {
    it('204 - admin supprime un tournoi', async () => {
      const tmpRes = await e2eRequest(app)
        .post('/tournaments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'A supprimer', gameId, maxPlayers: 2, startDate: '2026-11-01' });
      const tmpTournament = responseData<EntityWithId>(tmpRes);

      await e2eRequest(app)
        .delete(`/tournaments/${tmpTournament.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('403 - un user ne peut pas supprimer un tournoi', () => {
      return e2eRequest(app)
        .delete(`/tournaments/${tournamentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});
