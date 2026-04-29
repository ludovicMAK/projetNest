import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { JoinTournamentDto } from './dto/join-tournament.dto';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';

@ApiTags('tournaments')
@ApiBearerAuth()
@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des tournois' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'in_progress', 'completed'] })
  @ApiResponse({ status: 200, description: 'Liste retournée avec succès' })
  findAll(@Query('status') status?: string) {
    return this.tournamentService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détails d'un tournoi" })
  @ApiResponse({ status: 200, description: 'Tournoi trouvé' })
  @ApiResponse({ status: 404, description: 'Tournoi introuvable' })
  findOne(@Param('id') id: string) {
    return this.tournamentService.findOne(id);
  }

  @AdminOnly()
  @Post()
  @ApiOperation({ summary: 'Créer un tournoi (admin)' })
  @ApiResponse({ status: 201, description: 'Tournoi créé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
  create(@Body() dto: CreateTournamentDto) {
    return this.tournamentService.create(dto);
  }

  @AdminOnly()
  @Put(':id')
  @ApiOperation({ summary: 'Modifier un tournoi (admin)' })
  @ApiResponse({ status: 200, description: 'Tournoi mis à jour' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
  @ApiResponse({ status: 404, description: 'Tournoi introuvable' })
  update(@Param('id') id: string, @Body() dto: UpdateTournamentDto) {
    return this.tournamentService.update(id, dto);
  }

  @AdminOnly()
  @HttpCode(204)
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un tournoi (admin)' })
  @ApiResponse({ status: 204, description: 'Tournoi supprimé' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
  @ApiResponse({ status: 404, description: 'Tournoi introuvable' })
  remove(@Param('id') id: string) {
    return this.tournamentService.remove(id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: "S'inscrire à un tournoi" })
  @ApiResponse({ status: 201, description: 'Inscription réussie' })
  @ApiResponse({ status: 400, description: 'Tournoi plein, déjà inscrit ou non en attente' })
  @ApiResponse({ status: 404, description: 'Tournoi ou joueur introuvable' })
  join(@Param('id') tournamentId: string, @Body() dto: JoinTournamentDto) {
    return this.tournamentService.join(tournamentId, dto.playerId);
  }

  @AdminOnly()
  @Post(':id/start')
  @ApiOperation({ summary: 'Démarrer un tournoi et générer les matchs (admin)' })
  @ApiResponse({ status: 201, description: 'Tournoi démarré, matchs générés' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
  @ApiResponse({ status: 404, description: 'Tournoi introuvable' })
  start(@Param('id') id: string) {
    return this.tournamentService.start(id);
  }

  @Get(':id/matches')
  @ApiOperation({ summary: "Liste des matchs d'un tournoi" })
  @ApiResponse({ status: 200, description: 'Liste des matchs retournée' })
  @ApiResponse({ status: 404, description: 'Tournoi introuvable' })
  findMatches(@Param('id') id: string) {
    return this.tournamentService.getMatches(id);
  }
}
