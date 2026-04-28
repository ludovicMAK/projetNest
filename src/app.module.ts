import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from './player/player.module';
import { Player } from './player/entities/player.entity';
import { Tournament } from './tournament/entities/tournament.entity';
import { TournamentModule } from './tournament/tournament.module';
import { Match } from './match/entities/match.entity';
import { MatchModule } from './match/match.module';
import { Game } from './game/entities/game.entity';
import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'postgres',
      port: parseInt(process.env.DATABASE_PORT ?? '5432'),
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || 'root',
      database: process.env.DATABASE_NAME || 'lane',
      entities: [Player, Tournament, Match, Game],
      synchronize: true,
    }),
    PlayerModule,
    TournamentModule,
    MatchModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
