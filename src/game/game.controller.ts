import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Public } from '../auth/decorators/public.decorator';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste de tous les jeux' })
  @ApiResponse({ status: 200, description: 'Liste retournée avec succès' })
  findAll() {
    return this.gameService.findAll();
  }

  @AdminOnly()
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un jeu (admin)' })
  @ApiResponse({ status: 201, description: 'Jeu créé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
  create(@Body() dto: CreateGameDto) {
    return this.gameService.create(dto);
  }
}
