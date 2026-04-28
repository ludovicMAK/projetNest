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
  username: string;
  password?: string;
  role?: 'user' | 'admin';
  tournaments?: unknown[];
}

interface RegisterData {
  user: PlayerData;
}

interface LoginData {
  access_token: string;
}

describe('Players (e2e)', () => {
  let app: INestApplication;
  let playerId: string;
  let token: string;
  let adminToken: string;
  let promoteTargetId: string;

  beforeAll(async () => {
    app = await createTestApp();
    await clearDatabase(app);

    const registerRes = await e2eRequest(app).post('/auth/register').send({
      username: 'player1',
      email: 'player1@test.com',
      password: 'Password1!',
      avatar: 'https://example.com/avatar.png',
    });
    playerId = responseData<RegisterData>(registerRes).user.id;

    const loginRes = await e2eRequest(app)
      .post('/auth/login')
      .send({ username: 'player1', password: 'Password1!' });
    token = responseData<LoginData>(loginRes).access_token;

    await e2eRequest(app).post('/auth/register').send({
      username: 'player2',
      email: 'player2@test.com',
      password: 'Password2!',
      avatar: 'https://example.com/avatar2.png',
    });

    const adminRegisterRes = await e2eRequest(app).post('/auth/register').send({
      username: 'admin',
      email: 'admin@test.com',
      password: 'Admin1234!',
      avatar: 'https://example.com/admin.png',
    });
    const adminId = responseData<RegisterData>(adminRegisterRes).user.id;
    await promoteToAdmin(app, adminId);

    const adminLoginRes = await e2eRequest(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'Admin1234!' });
    adminToken = responseData<LoginData>(adminLoginRes).access_token;

    const promoteTargetRes = await e2eRequest(app).post('/auth/register').send({
      username: 'promoteme',
      email: 'promoteme@test.com',
      password: 'Password3!',
      avatar: 'https://example.com/promoteme.png',
    });
    promoteTargetId = responseData<RegisterData>(promoteTargetRes).user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /players', () => {
    it('200 - retourne la liste des joueurs', async () => {
      const res = await e2eRequest(app)
        .get('/players')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const data = responseData<PlayerData[]>(res);

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /players/:id', () => {
    it('200 - retourne le profil du joueur', async () => {
      const res = await e2eRequest(app)
        .get(`/players/${playerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const data = responseData<PlayerData>(res);

      expect(data.id).toBe(playerId);
      expect(data.username).toBe('player1');
      expect(data.password).toBeUndefined();
    });

    it('404 - joueur inexistant', () => {
      return e2eRequest(app)
        .get('/players/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('GET /players/:id/tournaments', () => {
    it('200 - retourne le joueur avec ses tournois', async () => {
      const res = await e2eRequest(app)
        .get(`/players/${playerId}/tournaments`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const data = responseData<PlayerData>(res);

      expect(data.id).toBe(playerId);
      expect(Array.isArray(data.tournaments)).toBe(true);
    });

    it('404 - joueur inexistant', () => {
      return e2eRequest(app)
        .get('/players/00000000-0000-0000-0000-000000000000/tournaments')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PATCH /players/:id/promote', () => {
    it('200 - admin promeut un joueur', async () => {
      const res = await e2eRequest(app)
        .patch(`/players/${promoteTargetId}/promote`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      const data = responseData<PlayerData>(res);

      expect(data.id).toBe(promoteTargetId);
      expect(data.role).toBe('admin');
    });

    it('403 - un user ne peut pas promouvoir un joueur', () => {
      return e2eRequest(app)
        .patch(`/players/${playerId}/promote`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('404 - joueur inexistant', () => {
      return e2eRequest(app)
        .patch('/players/00000000-0000-0000-0000-000000000000/promote')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
