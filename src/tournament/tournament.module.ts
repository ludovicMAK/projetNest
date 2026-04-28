import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { Tournament } from './entities/tournament.entity';
import { Player } from '../player/entities/player.entity';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Player]), MatchModule],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
