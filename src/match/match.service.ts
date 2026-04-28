import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { SubmitResultDto } from './dto/submit-result.dto';
import { Player } from '../player/entities/player.entity';
import { Tournament } from '../tournament/entities/tournament.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  createRound1Matches(tournamentId: string, players: Player[]): Promise<Match[]> {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const matches: Match[] = [];

    for (let i = 0; i + 1 < shuffled.length; i += 2) {
      matches.push(
        this.matchRepository.create({
          tournamentId,
          player1Id: shuffled[i].id,
          player2Id: shuffled[i + 1].id,
          round: 1,
          status: 'pending',
        }),
      );
    }

    return this.matchRepository.save(matches);
  }

  findByTournament(tournamentId: string): Promise<Match[]> {
    return this.matchRepository.find({
      where: { tournamentId },
      relations: ['player1', 'player2', 'winner'],
    });
  }

  async submitResult(matchId: string, dto: SubmitResultDto): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException(`Match ${matchId} introuvable`);
    }

    if (match.status === 'completed') {
      throw new BadRequestException('Ce match est déjà terminé');
    }

    if (match.player1Id !== dto.winnerId && match.player2Id !== dto.winnerId) {
      throw new BadRequestException("Le gagnant doit être l'un des deux joueurs du match");
    }

    match.winnerId = dto.winnerId;
    match.score = dto.score;
    match.status = 'completed';

    await this.matchRepository.save(match);

    const allMatches = await this.matchRepository.find({
      where: { tournamentId: match.tournamentId },
    });
    const allCompleted = allMatches.every((m) => m.status === 'completed');

    if (allCompleted) {
      await this.tournamentRepository.update(match.tournamentId, { status: 'completed' });
    }

    return this.matchRepository.findOneOrFail({
      where: { id: matchId },
      relations: ['player1', 'player2', 'winner'],
    });
  }
}
