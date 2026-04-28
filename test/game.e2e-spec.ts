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

interface GameData {
  id: string;
  name: string;
}

describe('Games (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;

  const validGame = {
    name: 'League of Legends',
    publisher: 'Riot Games',
    releaseDate: '2009-10-27',
    genre: 'MOBA',
  };

  beforeAll(async () => {
    app = await createTestApp();
    await clearDatabase(app);

    const adminRegister = await e2eRequest(app).post('/auth/register').send({
      username: 'admin',
      email: 'admin@test.com',
      password: 'Admin1234!',
      avatar: 'https://example.com/admin.png',
    });
    const adminRegisterData = responseData<RegisterData>(adminRegister);
    await promoteToAdmin(app, adminRegisterData.user.id);

    const adminLogin = await e2eRequest(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'Admin1234!' });
    adminToken = responseData<LoginData>(adminLogin).access_token;

    await e2eRequest(app).post('/auth/register').send({
      username: 'user',
      email: 'user@test.com',
      password: 'User1234!',
      avatar: 'https://example.com/user.png',
    });

    const userLogin = await e2eRequest(app)
      .post('/auth/login')
      .send({ username: 'user', password: 'User1234!' });
    userToken = responseData<LoginData>(userLogin).access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /games', () => {
    it('200 - retourne la liste des jeux', async () => {
      const res = await e2eRequest(app).get('/games').expect(200);
      const data = responseData<GameData[]>(res);

      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST /games', () => {
    it('201 - admin crée un jeu', async () => {
      const res = await e2eRequest(app)
        .post('/games')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validGame)
        .expect(201);
      const data = responseData<GameData>(res);

      expect(data.name).toBe(validGame.name);
      expect(data.id).toBeDefined();
    });

    it('403 - un user ne peut pas créer un jeu', () => {
      return e2eRequest(app)
        .post('/games')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validGame)
        .expect(403);
    });

    it('401 - non authentifié', () => {
      return e2eRequest(app).post('/games').send(validGame).expect(401);
    });

    it('400 - champs manquants', () => {
      return e2eRequest(app)
        .post('/games')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Incomplete' })
        .expect(400);
    });
  });
});
