import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerService } from './player.service';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';

@ApiTags('players')
@ApiBearerAuth()
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  @ApiOperation({ summary: 'Liste de tous les joueurs' })
  @ApiResponse({ status: 200, description: 'Liste retournée avec succès' })
  findAll() {
    return this.playerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Profil d'un joueur" })
  @ApiResponse({ status: 200, description: 'Joueur trouvé' })
  @ApiResponse({ status: 404, description: 'Joueur introuvable' })
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }

  @Get(':id/tournaments')
  @ApiOperation({ summary: "Tournois d'un joueur" })
  @ApiResponse({ status: 200, description: 'Liste des tournois du joueur' })
  @ApiResponse({ status: 404, description: 'Joueur introuvable' })
  findTournaments(@Param('id') id: string) {
    return this.playerService.findTournaments(id);
  }

  @AdminOnly()
  @Patch(':id/promote')
  @ApiOperation({ summary: 'Promouvoir un joueur en admin' })
  @ApiResponse({ status: 200, description: 'Joueur promu admin' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
  @ApiResponse({ status: 404, description: 'Joueur introuvable' })
  promote(@Param('id') id: string) {
    return this.playerService.promote(id);
  }
}
