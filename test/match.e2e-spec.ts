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

interface StartTournamentData {
  matches: EntityWithId[];
}

interface MatchData {
  winner: PlayerData;
  score: string;
  status: string;
}

describe('Matches (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let adminId: string;
  let userToken: string;
  let userId: string;
  let matchId: string;
  let winnerId: string;
  let loserId: string;

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
        name: 'Valorant',
        publisher: 'Riot Games',
        releaseDate: '2020-06-02',
        genre: 'FPS',
      });
    const gameId = responseData<EntityWithId>(gameRes).id;

    const tournamentRes = await e2eRequest(app)
      .post('/tournaments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Tournoi Match Test',
        gameId,
        maxPlayers: 2,
        startDate: '2026-12-01',
      });
    const tournamentId = responseData<EntityWithId>(tournamentRes).id;

    await e2eRequest(app)
      .post(`/tournaments/${tournamentId}/join`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ playerId: adminId });

    await e2eRequest(app)
      .post(`/tournaments/${tournamentId}/join`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ playerId: userId });

    const startRes = await e2eRequest(app)
      .post(`/tournaments/${tournamentId}/start`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);

    const matches = responseData<StartTournamentData>(startRes).matches;
    matchId = matches[0].id;
    winnerId = adminId;
    loserId = userId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /matches/:id/result', () => {
    it("201 - admin soumet le résultat d'un match", async () => {
      const res = await e2eRequest(app)
        .post(`/matches/${matchId}/result`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ winnerId, score: '13-7' })
        .expect(201);
      const data = responseData<MatchData>(res);

      expect(data.winner.id).toBe(winnerId);
      expect(data.score).toBe('13-7');
      expect(data.status).toBe('completed');
    });

    it('400 - match déjà terminé', () => {
      return e2eRequest(app)
        .post(`/matches/${matchId}/result`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ winnerId, score: '10-5' })
        .expect(400);
    });

    it('403 - un user ne peut pas soumettre un résultat', () => {
      return e2eRequest(app)
        .post(`/matches/${matchId}/result`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ winnerId, score: '13-7' })
        .expect(403);
    });

    it('401 - non authentifié', () => {
      return e2eRequest(app)
        .post(`/matches/${matchId}/result`)
        .send({ winnerId, score: '13-7' })
        .expect(401);
    });

    it('400 - winnerId invalide (non UUID)', () => {
      return e2eRequest(app)
        .post(`/matches/${matchId}/result`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ winnerId: 'not-a-uuid', score: '13-7' })
        .expect(400);
    });

    it('404 - match inexistant', () => {
      return e2eRequest(app)
        .post('/matches/00000000-0000-0000-0000-000000000000/result')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ winnerId: loserId, score: '5-13' })
        .expect(404);
    });
  });
});
