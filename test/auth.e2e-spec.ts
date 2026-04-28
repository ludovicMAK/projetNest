import type { INestApplication } from '@nestjs/common';
import { clearDatabase, createTestApp, e2eRequest, responseData } from './helpers/test-app';

interface AuthUser {
  username: string;
  password?: string;
}

interface RegisterData {
  user: AuthUser;
}

interface LoginData {
  access_token: string;
}

describe('Auth (e2e)', () => {
  let app: INestApplication;

  const validPlayer = {
    username: 'testuser',
    email: 'testuser@test.com',
    password: 'Password1!',
    avatar: 'https://example.com/avatar.png',
  };

  beforeAll(async () => {
    app = await createTestApp();
    await clearDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('201 - inscrit un joueur valide', async () => {
      const res = await e2eRequest(app).post('/auth/register').send(validPlayer).expect(201);
      const data = responseData<RegisterData>(res);

      expect(data.user.username).toBe(validPlayer.username);
      expect(data.user.password).toBeUndefined();
    });

    it('409 - username déjà pris', () => {
      return e2eRequest(app).post('/auth/register').send(validPlayer).expect(409);
    });

    it('400 - email invalide', () => {
      return e2eRequest(app)
        .post('/auth/register')
        .send({ ...validPlayer, username: 'other', email: 'not-an-email' })
        .expect(400);
    });

    it('400 - mot de passe trop court', () => {
      return e2eRequest(app)
        .post('/auth/register')
        .send({ ...validPlayer, username: 'other2', email: 'other2@test.com', password: 'short' })
        .expect(400);
    });

    it('400 - champs manquants', () => {
      return e2eRequest(app).post('/auth/register').send({ username: 'nopass' }).expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('201 - retourne un access_token', async () => {
      const res = await e2eRequest(app)
        .post('/auth/login')
        .send({ username: validPlayer.username, password: validPlayer.password })
        .expect(201);
      const data = responseData<LoginData>(res);

      expect(data.access_token).toBeDefined();
      expect(typeof data.access_token).toBe('string');
    });

    it('401 - mauvais mot de passe', () => {
      return e2eRequest(app)
        .post('/auth/login')
        .send({ username: validPlayer.username, password: 'wrongpassword' })
        .expect(401);
    });

    it('401 - utilisateur inconnu', () => {
      return e2eRequest(app)
        .post('/auth/login')
        .send({ username: 'nobody', password: 'Password1!' })
        .expect(401);
    });
  });
});
