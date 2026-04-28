// src/tournament/tournament.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { Player } from '../player/entities/player.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async findAll(status?: string): Promise<Tournament[]> {
    if (status) {
      return this.tournamentRepository.find({
        where: { status: status as Tournament['status'] },
        relations: ['players'],
      });
    }
    return this.tournamentRepository.find({
      relations: ['players'],
    });
  }

  async findOne(id: string): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
      relations: ['players'],
    });
    if (!tournament) {
      throw new NotFoundException(`Tournoi ${id} introuvable`);
    }
    return tournament;
  }

  async create(dto: CreateTournamentDto): Promise<Tournament> {
    const tournament = this.tournamentRepository.create({
      ...dto,
      startDate: new Date(dto.startDate),
    });
    return this.tournamentRepository.save(tournament);
  }

  async update(id: string, dto: UpdateTournamentDto): Promise<Tournament> {
    const tournament = await this.findOne(id);
    Object.assign(tournament, dto);
    return this.tournamentRepository.save(tournament);
  }

  async remove(id: string): Promise<void> {
    const tournament = await this.findOne(id);
    await this.tournamentRepository.remove(tournament);
  }

  async join(tournamentId: string, playerId: string): Promise<Tournament> {
    const tournament = await this.findOne(tournamentId);
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException(`Joueur ${playerId} introuvable`);
    }

    if (tournament.status !== 'pending') {
      throw new BadRequestException('Impossible de rejoindre un tournoi déjà commencé ou terminé');
    }

    if (tournament.players.length >= tournament.maxPlayers) {
      throw new BadRequestException('Le tournoi est complet');
    }

    const dejaInscrit = tournament.players.some((p) => p.id === playerId);
    if (dejaInscrit) {
      throw new BadRequestException('Le joueur est déjà inscrit à ce tournoi');
    }

    tournament.players.push(player);
    return this.tournamentRepository.save(tournament);
  }
}
