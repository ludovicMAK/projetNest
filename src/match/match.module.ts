import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Tournament } from '../tournament/entities/tournament.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Tournament])],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
