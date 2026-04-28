import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { SubmitResultDto } from './dto/submit-result.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @UseGuards(AdminGuard)
  @Post(':id/result')

  @ApiOperation({ summary: "Soumettre le résultat d'un match (admin)" })
  @ApiResponse({ status: 201, description: 'Résultat enregistré' })
  @ApiResponse({ status: 400, description: "Le gagnant doit être l'un des deux joueurs" })
  @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
  @ApiResponse({ status: 404, description: 'Match introuvable' })
  
  submitResult(@Param('id') id: string, @Body() dto: SubmitResultDto) {
    return this.matchService.submitResult(id, dto);
  }
}
