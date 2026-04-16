import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from './player/player.module';
import { Player } from './player/entities/player.entity';
import { Tournament } from './tournament/entities/tournament.entity';
import { TournamentModule } from './tournament/tournament.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'postgres',
      port: parseInt(process.env.DATABASE_PORT ?? '5432'),
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || 'root',
      database: process.env.DATABASE_NAME || 'lane',
      entities: [Player, Tournament],
      synchronize: true,
    }),
    PlayerModule,
    TournamentModule,
  ],
})
export class AppModule {}
