import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { Response } from 'supertest';
import type { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { TransformResponseInterceptor } from '../../src/common/interceptors/transform-response.interceptor';

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
}

export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  await app.init();
  return app;
}

export async function clearDatabase(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  await dataSource.query(`TRUNCATE matches, tournaments, players, games CASCADE`);
}

export async function promoteToAdmin(app: INestApplication, playerId: string): Promise<void> {
  const dataSource = app.get(DataSource);
  await dataSource.query(`UPDATE players SET role = 'admin' WHERE id = $1`, [playerId]);
}

export function e2eRequest(app: INestApplication): request.Agent {
  return request(app.getHttpServer() as App);
}

export function responseData<T>(response: Response): T {
  return (response.body as ApiResponse<T>).data;
}
